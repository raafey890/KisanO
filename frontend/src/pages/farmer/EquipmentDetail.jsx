import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  MapPin,
  ShieldCheck,
  Phone,
  MessageSquare,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TractorEquipment,
  HarvesterEquipment,
  RotavatorEquipment,
  CultivatorEquipment,
  SeedDrillEquipment,
  CropSprayerService,
} from '../../assets/images';
import api from '../../services/api';

const MOCK_EQUIPMENT_DATA = {
  id: 'eq-1',
  equipmentName: 'Mahindra 575 DI 45 HP Tractor',
  equipmentType: 'Tractor',
  brand: 'Mahindra',
  dailyRate: 4500,
  hourlyRate: 650,
  distanceKm: 3.2,
  location: 'Nashik West',
  availabilityStatus: 'Available Today',
  rating: 4.9,
  reviewsCount: 28,
  image: TractorEquipment,
  gallery: [TractorEquipment, RotavatorEquipment, CultivatorEquipment],
  // Quick Information (useful for farmers)
  hp: '45 HP',
  fuelType: 'Diesel',
  suitableFarmSize: '2 – 10 Acres',
  attachmentsIncluded: 'Rotavator & Cultivator Compatible',
  // Owner Information
  owner: {
    name: 'Anandrao Deshmukh',
    village: 'Nashik West',
    rating: 4.9,
    completedRentals: 124,
    phone: '+91 98220 12345',
    verified: true,
  },
  // Short Farmer Reviews (Max 3)
  reviews: [
    {
      id: 1,
      farmerName: 'Suresh Patil',
      rating: 5,
      date: '2 days ago',
      comment: 'Tractor was in excellent condition. Anandrao delivered it right to my field in 30 minutes!',
    },
    {
      id: 2,
      farmerName: 'Ramesh Pawar',
      rating: 5,
      date: '1 week ago',
      comment: 'Very reliable machine for deep plowing. Clean engine and very fair daily rental rate.',
    },
    {
      id: 3,
      farmerName: 'Ganesh Shinde',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Smooth operation and diesel efficiency is great. Highly recommended for Nashik farmers.',
    },
  ],
};

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState(MOCK_EQUIPMENT_DATA);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/equipment/${id}`);
        if (res.data?.success && res.data.data) {
          setEquipment({
            ...MOCK_EQUIPMENT_DATA,
            ...res.data.data,
            image: res.data.data.image || TractorEquipment,
          });
        }
      } catch (err) {
        // Fallback to mock data if offline
      }
    };
    fetchDetail();
  }, [id]);

  const handleRentNow = () => {
    navigate(`/farmer/equipment/${id}/availability`, {
      state: {
        equipment,
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 font-sans pb-24 pt-2 px-2 sm:px-4">
      {/* 1. TOP BACK NAVIGATION */}
      <div>
        <button
          onClick={() => navigate('/farmer/equipment')}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-gray-700 hover:text-gray-900 bg-white px-4 py-2.5 rounded-2xl border border-gray-200 shadow-sm transition-all hover:scale-105 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Equipment Search</span>
        </button>
      </div>

      {/* 2. MAIN GRID (Left Content & Right Sticky Action Box) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          {/* HERO IMAGE GALLERY */}
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl relative h-80 sm:h-[420px]">
              <img
                src={equipment.gallery?.[activeImageIndex] || equipment.image}
                alt={equipment.equipmentName}
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-green-600 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {equipment.availabilityStatus}
                </span>
                <span className="bg-gray-900/90 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md backdrop-blur-md flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-green-400" /> Verified Equipment
                </span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {equipment.gallery && equipment.gallery.length > 1 && (
              <div className="flex items-center gap-3">
                {equipment.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? 'border-green-600 scale-105 shadow-md' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* TITLE & PRICE SUMMARY */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
                  {equipment.equipmentName}
                </h1>
                <div className="flex items-center gap-4 mt-2 text-sm font-semibold text-gray-600">
                  <span className="flex items-center gap-1 text-amber-600">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <strong className="text-gray-900">{equipment.rating}</strong> ({equipment.reviewsCount} reviews)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-green-700 font-bold bg-green-50 px-2.5 py-0.5 rounded-md">
                    <MapPin className="w-4 h-4 text-green-600" />
                    {equipment.distanceKm} km away ({equipment.location})
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Daily Price</span>
                <div className="text-3xl font-black text-gray-900">
                  ₹{equipment.dailyRate?.toLocaleString()}
                  <span className="text-sm font-bold text-gray-500"> / day</span>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK INFORMATION (Farmer-Useful Specs Only) */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">Quick Information</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-gray-400 block">Horsepower</span>
                <span className="text-base font-black text-gray-900 mt-1 block">{equipment.hp}</span>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-gray-400 block">Fuel Type</span>
                <span className="text-base font-black text-gray-900 mt-1 block">{equipment.fuelType}</span>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-gray-400 block">Suitable Farm Size</span>
                <span className="text-base font-black text-gray-900 mt-1 block">{equipment.suitableFarmSize}</span>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-gray-400 block">Attachments</span>
                <span className="text-xs font-bold text-gray-900 mt-1 block leading-tight">
                  {equipment.attachmentsIncluded}
                </span>
              </div>
            </div>
          </div>

          {/* OWNER CARD */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">Verified Equipment Owner</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-700 font-black text-2xl flex items-center justify-center border border-green-200 shrink-0">
                  {equipment.owner.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-gray-900">{equipment.owner.name}</h3>
                    <span className="bg-green-100 text-green-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-green-200">
                      <ShieldCheck className="w-3 h-3 text-green-600" /> Verified
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    {equipment.owner.village} • ⭐ {equipment.owner.rating} ({equipment.owner.completedRentals}+ Completed Rentals)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={`tel:${equipment.owner.phone}`}
                  className="flex-1 sm:flex-none h-12 px-5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Owner</span>
                </a>
                <button
                  onClick={() => alert(`Opening direct chat with ${equipment.owner.name}`)}
                  className="flex-1 sm:flex-none h-12 px-5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 border border-gray-300 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat</span>
                </button>
              </div>
            </div>
          </div>

          {/* AVAILABILITY OVERVIEW */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">Availability</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-green-900 block">Available Today</span>
                  <span className="text-[10px] text-green-700 font-medium">Ready for dispatch</span>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-green-900 block">Available Tomorrow</span>
                  <span className="text-[10px] text-green-700 font-medium">Slots open</span>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-green-900 block">Available This Week</span>
                  <span className="text-[10px] text-green-700 font-medium">Flexible dates</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleRentNow}
              className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs rounded-2xl border border-gray-300 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Check Full Availability & Time Slots</span>
            </button>
          </div>

          {/* REVIEWS (Maximum 3 Farmer Reviews) */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">Farmer Reviews</h2>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {equipment.rating} ({equipment.reviewsCount})
              </span>
            </div>

            <div className="space-y-4 divide-y divide-gray-100">
              {equipment.reviews.slice(0, 3).map((rev) => (
                <div key={rev.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">{rev.farmerName}</span>
                    <span className="text-xs font-bold text-amber-500">{'★'.repeat(rev.rating)}</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">"{rev.comment}"</p>
                  <span className="text-[10px] text-gray-400 block">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY RENT ACTION BOX */}
        <div className="bg-white border-2 border-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 lg:sticky lg:top-8">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Daily Rate</span>
            <div className="text-3xl font-black text-gray-900 mt-1">
              ₹{equipment.dailyRate?.toLocaleString()}
              <span className="text-xs font-bold text-gray-500"> / day</span>
            </div>
            <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-md inline-block mt-2">
              Pay on Delivery Available
            </span>
          </div>

          <div className="space-y-3 text-xs font-bold text-gray-700 border-t border-b border-gray-100 py-4">
            <div className="flex justify-between">
              <span>Machinery Type:</span>
              <span className="text-gray-900">{equipment.equipmentType}</span>
            </div>
            <div className="flex justify-between">
              <span>Power:</span>
              <span className="text-gray-900">{equipment.hp}</span>
            </div>
            <div className="flex justify-between">
              <span>Distance:</span>
              <span className="text-gray-900">{equipment.distanceKm} km away</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>Status:</span>
              <span>Available Today</span>
            </div>
          </div>

          {/* PRIMARY ACTION BUTTON */}
          <button
            onClick={handleRentNow}
            className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-black text-base rounded-2xl transition-all shadow-[0_0_25px_rgba(34,197,94,0.35)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Rent Now</span>
            <Zap className="w-5 h-5 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

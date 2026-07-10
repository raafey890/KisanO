import { Card } from "./components/ui/Card";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
      <Card
        header="KisanO Card"
        body="This is our first enterprise card."
        actions={<button className="px-4 py-2 bg-green-600 text-white rounded">Explore</button>}
      />
    </div>
  );
}

export default App;
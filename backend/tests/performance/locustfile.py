from locust import HttpUser, task, between
import os

class KisanOApiUser(HttpUser):
    # Wait time between simulated user actions
    wait_time = between(1, 3)

    def on_start(self):
        """
        Runs once per virtual user when they spawn.
        Good place to hit /login and store the JWT.
        """
        # MVP Placeholder for load test auth
        self.client.headers = {"Authorization": "Bearer fake_token_for_now"}

    @task(3)
    def check_health(self):
        """
        Simulate a user hitting the healthcheck.
        Weight is 3, so it happens 3x more often than weight 1 tasks.
        """
        self.client.get("/health")

    @task(1)
    def fetch_equipment(self):
        """
        Simulate browsing the marketplace.
        """
        self.client.get("/api/v1/equipment")

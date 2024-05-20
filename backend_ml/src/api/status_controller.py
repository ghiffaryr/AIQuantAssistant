class Status:
    async def on_get(self, req, resp) -> None:
        resp.text = "ok"
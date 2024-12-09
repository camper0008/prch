Deno.serve((req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("open", (event) => {
    console.log("open");
    console.log(event);
    console.log("a client connected!");
  });

  socket.addEventListener("message", (event) => {
    console.log("data");
    console.log(event);
    socket.send(event.data);
  });

  return response;
});

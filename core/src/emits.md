io.to(id).emit('progress', {
icon: 'tool',
message: 'Selecting tools to satisfy your query...',
});

io.to(id).emit('progress', {
icon: 'tool',
message: 'Selected tools are - ' + response.data.tools.join(', '),
});

// api/pagar/index.js
module.exports = async (req, res) => {
  res.status(200).send(`
    <h1>✅ ENDPOINT ALCANZADO</h1>
    <p>Si ves este mensaje, el problema del 404 está resuelto.</p>
    <p>Plan recibido: ${req.query.plan || 'ninguno'}</p>
  `);
};

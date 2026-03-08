// api/pagar.js
module.exports = (req, res) => {
  res.status(200).send(`
    <h1 style="color:green; font-family:Arial">✅ ENDPOINT ALCANZADO</h1>
    <p>Si ves este mensaje verde, el servidor funciona.</p>
    <p>Plan recibido: ${req.query.plan || 'ninguno'}</p>
  `);
};

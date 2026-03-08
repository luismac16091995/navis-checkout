// api/pagar/index.js
module.exports = async (req, res) => {
  res.status(200).send(`
    <h1 style="color:green">✅ ENDPOINT ALCANZADO CORRECTAMENTE</h1>
    <p>Si ves este mensaje, el problema del 500 está resuelto.</p>
    <p>Plan recibido: ${req.query.plan || 'ninguno'}</p>
    <p>UID recibido: ${req.query.uid || 'ninguno'}</p>
    <p><strong>El servidor funciona.</strong></p>
  `);
};

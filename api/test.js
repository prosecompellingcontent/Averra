export default function handler(req, res) {
  console.log('✅ TEST ENDPOINT HIT!');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  
  res.status(200).json({
    success: true,
    message: 'API route is working!',
    method: req.method,
    timestamp: new Date().toISOString()
  });
}

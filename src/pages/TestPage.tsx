// Simple test page to verify React is working
export default function TestPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'white', 
      color: 'black', 
      padding: '50px',
      fontFamily: 'Arial'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>✅ React is Working!</h1>
      <p style={{ fontSize: '24px', marginBottom: '10px' }}>If you can see this, React is rendering correctly.</p>
      <p style={{ fontSize: '18px', color: '#666' }}>Current URL: {window.location.href}</p>
      <p style={{ fontSize: '18px', color: '#666' }}>Time: {new Date().toLocaleString()}</p>
      
      <div style={{ marginTop: '30px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Navigation Test:</h2>
        <a href="/" style={{ display: 'block', margin: '10px 0', color: 'blue' }}>Go to Home</a>
        <a href="/login" style={{ display: 'block', margin: '10px 0', color: 'blue' }}>Go to Login</a>
        <a href="/signup" style={{ display: 'block', margin: '10px 0', color: 'blue' }}>Go to Signup</a>
        <a href="/challenges" style={{ display: 'block', margin: '10px 0', color: 'blue' }}>Go to Challenges</a>
      </div>
    </div>
  )
}


import React from 'react';
import { Target, Users, ShieldCheck } from 'lucide-react';

function About() {
  const features = [
    { icon: <Target color="#2563eb" />, title: "Our Mission", desc: "To make property buying as easy as clicking a button." },
    { icon: <Users color="#2563eb" />, title: "User First", desc: "Dedicated portals for both Agents and regular Buyers." },
    { icon: <ShieldCheck color="#2563eb" />, title: "Secure Deals", desc: "Verified listings and secure lease agreements." }
  ];

  return (
    <div id="about" style={{ padding: '100px 10%', backgroundColor: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h6 style={{ color: '#2563eb', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Who We Are</h6>
        <h2 style={{ fontSize: '2.5rem', color: '#0f172a', marginTop: '10px' }}>Our Vision for the Future</h2>
      </div>

      <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {features.map((item, i) => (
          <div key={i} style={{ flex: '1', minWidth: '250px', padding: '30px', borderRadius: '20px', border: '1px solid #f1f5f9', textAlign: 'center', transition: '0.3s' }}>
            <div style={{ marginBottom: '20px', display: 'inline-block', padding: '15px', backgroundColor: '#eff6ff', borderRadius: '50%' }}>{item.icon}</div>
            <h3 style={{ marginBottom: '10px', color: '#1e293b' }}>{item.title}</h3>
            <p style={{ color: '#64748b', lineHeight: '1.6' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
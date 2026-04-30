import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Building2, Crown } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Pricing = ({ user }) => {
  const navigate = useNavigate();

  // ✅ Stripe Payment Links
  const STRIPE_LINKS = {
    pro: "https://buy.stripe.com/test_bJe7sN1Uo2jT5Fy0D62kw00",
    enterprise: "https://buy.stripe.com/test_9B614paqU4s12tm1Ha2kw01"
  };

  const plans = [
    {
      name: 'Starter',
      price: 0,
      description: 'Perfect for individual sellers testing the market.',
      icon: <Building2 size={24} color="#64748b" />,
      features: ['1 Property Listing', 'Basic Support', 'Standard Analytics', 'Mobile App Access'],
      planKey: 'basic'
    },
    {
      name: 'Professional',
      price: 49,
      description: 'The best choice for active real estate agents.',
      icon: <Zap size={24} color="#2563eb" />,
      features: ['10 Property Listings', 'Priority Support', 'Advanced Analytics', 'Featured Badge', 'Lead Management'],
      planKey: 'pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 199,
      description: 'Built for large agencies and developers.',
      icon: <Crown size={24} color="#7c3aed" />,
      features: ['Unlimited Listings', 'Dedicated Account Manager', 'Custom Branding', 'API Access', 'Multi-user Access'],
      planKey: 'enterprise'
    }
  ];

  // ✅ Update user plan in Supabase
  const updateUserPlan = async (plan, status = "active") => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!currentUser) return;

    await supabase
      .from("users")
      .update({
        plan: plan,
        plan_status: status,
        updated_at: new Date()
      })
      .eq("id", currentUser.id);
  };

  // ✅ Main handler
  const handlePlanSelection = async (plan) => {

    // 1. Check login
    if (!user) {
      navigate('/login', {
        state: { redirectTo: '/pricing', selectedPlan: plan.planKey }
      });
      return;
    }

    // 2. Free plan
    if (plan.price === 0) {
      alert("✅ Free plan activated (1 listing for 30 days)");

      await updateUserPlan('basic', 'active');

      navigate('/agent-portal');
      return;
    }

    // 3. Paid plan confirm
    const confirmTrial = window.confirm(
      `🚀 Start ${plan.name} plan?\n\nYou’ll be redirected to secure payment.`
    );

    if (!confirmTrial) return;

    try {
      // 4. Mark as pending before payment
      await updateUserPlan(plan.planKey, 'pending');

      // 5. Redirect to Stripe
      window.location.href = STRIPE_LINKS[plan.planKey];

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Simple, Transparent Pricing</h1>
        <p style={styles.subtitle}>Choose the plan that fits your real estate goals.</p>
      </div>

      <div style={styles.grid}>
        {plans.map((plan) => (
          <div 
            key={plan.planKey} 
            style={{
              ...styles.card,
              border: plan.popular ? '2px solid #2563eb' : '1px solid #e2e8f0',
              transform: plan.popular ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {plan.popular && <div style={styles.popularBadge}>Most Popular</div>}
            
            <div style={styles.iconBox}>{plan.icon}</div>
            <h3 style={styles.planName}>{plan.name}</h3>

            <div style={styles.priceContainer}>
              <span style={styles.currency}>$</span>
              <span style={styles.price}>{plan.price}</span>
              <span style={styles.duration}>/mo</span>
            </div>

            <p style={styles.description}>{plan.description}</p>

            <div style={styles.featureList}>
              {plan.features.map((feature, i) => (
                <div key={i} style={styles.featureItem}>
                  <Check size={16} color="#10b981" />
                  <span style={styles.featureText}>{feature}</span>
                </div>
              ))}
            </div>

            <button 
              style={{
                ...styles.button,
                backgroundColor: plan.popular ? '#2563eb' : '#0f172a'
              }}
              onClick={() => handlePlanSelection(plan)}
            >
              {user?.plan === plan.planKey
                ? 'Current Plan'
                : plan.price === 0
                ? 'Start Free'
                : 'Start Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ✅ Styles
const styles = {
  container: { padding: '100px 6%', backgroundColor: '#f8fafc', minHeight: '100vh' },
  header: { textAlign: 'center', marginBottom: '60px' },
  title: { fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '15px' },
  subtitle: { fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto', alignItems: 'center' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'relative', display: 'flex', flexDirection: 'column' },
  popularBadge: { position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2563eb', color: 'white', padding: '6px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' },
  iconBox: { marginBottom: '20px' },
  planName: { fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px' },
  priceContainer: { marginBottom: '20px', display: 'flex', alignItems: 'baseline' },
  currency: { fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' },
  price: { fontSize: '3rem', fontWeight: '800', color: '#0f172a' },
  duration: { color: '#64748b', fontWeight: '600' },
  description: { color: '#64748b', fontSize: '0.95rem', marginBottom: '30px', lineHeight: '1.5' },
  featureList: { marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '15px' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '12px' },
  featureText: { color: '#475569', fontSize: '0.9rem', fontWeight: '500' },
  button: { width: '100%', padding: '14px', border: 'none', borderRadius: '12px', color: 'white', fontWeight: '700', cursor: 'pointer' }
};

export default Pricing;
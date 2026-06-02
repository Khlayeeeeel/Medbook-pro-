import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Stethoscope,
  Calendar,
  MessageSquare,
  Shield,
  Clock,
  Users,
  ArrowRight,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { specialties } from '@/data/mockData';

const Index = () => {
  const navigate = useNavigate();
  const { user, login, signup, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    specialty: '',
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (user) return null;

  // Debug logging
  console.log('Index component - isLoading:', isLoading, 'user:', user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password, role);
        toast.success('Welcome back!');
      } else {
        await signup(formData.email, formData.password, formData.name, role, formData.specialty);
        toast.success('Account created successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const features = [
    {
      icon: Calendar,
      title: 'Easy Scheduling',
      description: 'Book appointments with just a few clicks. View real-time availability.',
    },
    {
      icon: MessageSquare,
      title: 'Secure Chat',
      description: 'Communicate directly with your healthcare provider anytime.',
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Your health data is protected with enterprise-grade security.',
    },
    {
      icon: Clock,
      title: 'Instant Confirmations',
      description: 'Get immediate confirmation and reminders for your appointments.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 medical-gradient opacity-5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/2 h-full medical-gradient opacity-10 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl medical-gradient shadow-medical">
                <Stethoscope className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                MedBook<span className="text-secondary">Pro</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">About</Button>
              <Button variant="ghost">Contact</Button>
            </div>
          </header>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center py-8">
            {/* Left Column - Hero Text */}
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                  <Users className="h-4 w-4" />
                  Trusted by 10,000+ patients
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Healthcare Made{' '}
                  <span className="text-transparent bg-clip-text medical-gradient">
                    Simple
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Book appointments, chat with doctors, and manage your health records
                  all in one secure platform. Your wellness journey starts here.
                </p>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                {['24/7 Support', 'Instant Booking', 'Verified Doctors', 'Secure & Private'].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-success" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Auth Card */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <Card className="shadow-card border-border/50">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">Get Started</CardTitle>
                  <CardDescription>
                    Sign in or create an account to continue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Role Selection */}
                  <div className="flex gap-2 p-1 bg-muted rounded-lg mb-6">
                    <Button
                      variant={role === 'patient' ? 'default' : 'ghost'}
                      className="flex-1"
                      onClick={() => setRole('patient')}
                    >
                      I'm a Patient
                    </Button>
                    <Button
                      variant={role === 'doctor' ? 'default' : 'ghost'}
                      className="flex-1"
                      onClick={() => setRole('doctor')}
                    >
                      I'm a Doctor
                    </Button>
                  </div>

                  <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as 'login' | 'signup')}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="login">Sign In</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <form onSubmit={handleSubmit}>
                      <TabsContent value="login" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email">Email</Label>
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password">Password</Label>
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" variant="hero" size="lg" disabled={isLoading}>
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              Sign In
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </TabsContent>

                      <TabsContent value="signup" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name">Full Name</Label>
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="John Smith"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                          />
                        </div>
                        {role === 'doctor' && (
                          <div className="space-y-2">
                            <Label htmlFor="specialty">Specialty</Label>
                            <Select
                              value={formData.specialty}
                              onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select specialty" />
                              </SelectTrigger>
                              <SelectContent>
                                {specialties.map((specialty) => (
                                  <SelectItem key={specialty} value={specialty}>
                                    {specialty}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        <Button type="submit" className="w-full" variant="hero" size="lg" disabled={isLoading}>
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 " />
                          ) : (
                            <>
                              Create Account
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </TabsContent>
                    </form>
                  </Tabs>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything you need for better healthcare
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides a seamless experience for both patients and healthcare providers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="border-border/50 hover:shadow-card transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-xl medical-gradient-soft flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">MedBook Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 MedBook Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

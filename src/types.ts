export interface PlushieItem {
  id: string;
  name: string;
  codename: string; // matches 3D model setup
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  category: 'Sprouts' | 'Forest' | 'Tiny' | 'Limited';
  primaryColor: string; // hex representation for 3D Customizer
  bellyColor: string;
  cheekColor: string;
  isLimited: boolean;
  accentType: 'dino' | 'bear' | 'frog' | 'sprout'; // what 3D shapes to render
  imageUrl?: string; // a pretty background graphic or stylized vector
}

export interface Testimonial {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number;
  date: string;
  text: string;
  adoptedPlushie: string;
  heartColor: string;
}

export interface AdoptionProfile {
  name: string;
  birthDate: string;
  weight: string; // e.g. "450g"
  personality: 'Sleepy' | 'Playful' | 'Chaotic Cozy' | 'Zen Master' | 'Waffle-Lover';
  accessory: 'none' | 'scarf' | 'bow' | 'sprout_leaf' | 'flower';
  color: string;
}

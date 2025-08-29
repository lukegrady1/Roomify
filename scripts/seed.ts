import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database.types';

// Sample data for seeding
const SAMPLE_CAMPUSES = [
  {
    name: 'Harvard University',
    city: 'Cambridge',
    state: 'MA',
    country: 'USA',
    lat: 42.3744,
    lng: -71.1169,
    slug: 'harvard-university'
  },
  {
    name: 'MIT',
    city: 'Cambridge', 
    state: 'MA',
    country: 'USA',
    lat: 42.3601,
    lng: -71.0942,
    slug: 'mit'
  },
  {
    name: 'Boston University',
    city: 'Boston',
    state: 'MA', 
    country: 'USA',
    lat: 42.3505,
    lng: -71.1054,
    slug: 'boston-university'
  },
  {
    name: 'Stanford University',
    city: 'Stanford',
    state: 'CA',
    country: 'USA', 
    lat: 37.4275,
    lng: -122.1697,
    slug: 'stanford-university'
  },
  {
    name: 'University of California, Berkeley',
    city: 'Berkeley',
    state: 'CA',
    country: 'USA',
    lat: 37.8719,
    lng: -122.2585,
    slug: 'uc-berkeley'
  },
  {
    name: 'New York University',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    lat: 40.7282,
    lng: -73.9962,
    slug: 'nyu'
  },
  {
    name: 'Columbia University',
    city: 'New York', 
    state: 'NY',
    country: 'USA',
    lat: 40.8075,
    lng: -73.9626,
    slug: 'columbia-university'
  },
  {
    name: 'University of Chicago',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    lat: 41.7886,
    lng: -87.5987,
    slug: 'university-of-chicago'
  },
  {
    name: 'Northwestern University',
    city: 'Evanston',
    state: 'IL', 
    country: 'USA',
    lat: 42.0564,
    lng: -87.6753,
    slug: 'northwestern-university'
  },
  {
    name: 'University of Pennsylvania',
    city: 'Philadelphia',
    state: 'PA',
    country: 'USA',
    lat: 39.9522,
    lng: -75.1932,
    slug: 'upenn'
  }
];

const SAMPLE_LISTINGS = [
  {
    title: 'Cozy Studio Apartment Near Harvard',
    description: 'Beautiful studio apartment just 10 minutes walk from Harvard Yard. Recently renovated with modern amenities, high ceilings, and plenty of natural light. Perfect for graduate students or young professionals.',
    price: 2400,
    room_type: 'entire' as const,
    bedrooms: 1,
    bathrooms: 1,
    address_line1: '123 Harvard Street',
    city: 'Cambridge',
    state: 'MA',
    postal_code: '02138',
    campus_slug: 'harvard-university',
    amenities: ['wifi', 'laundry', 'furnished', 'utilities_included'],
    photos: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&q=80'
    ]
  },
  {
    title: 'Shared Room in MIT Area',
    description: 'Great shared accommodation with other graduate students. Close to MIT campus and public transportation. Modern kitchen, study areas, and great community atmosphere.',
    price: 1200,
    room_type: 'shared' as const,
    bedrooms: 4,
    bathrooms: 2,
    address_line1: '456 MIT Avenue',
    city: 'Cambridge', 
    state: 'MA',
    postal_code: '02139',
    campus_slug: 'mit',
    amenities: ['wifi', 'kitchen', 'parking', 'utilities_included'],
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&q=80'
    ]
  },
  {
    title: 'Private Room Near Boston University',
    description: 'Private bedroom in shared house. Walking distance to BU campus. Fully furnished with comfortable bed, desk, and plenty of storage. Safe, student-friendly neighborhood.',
    price: 1800,
    room_type: 'private' as const,
    bedrooms: 1,
    bathrooms: 1,
    address_line1: '789 BU Boulevard',
    city: 'Boston',
    state: 'MA',
    postal_code: '02215',
    campus_slug: 'boston-university',
    amenities: ['wifi', 'laundry', 'utilities_included', 'furnished'],
    photos: [
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80'
    ]
  },
  {
    title: 'Modern Apartment Near Stanford',
    description: 'Spacious 2-bedroom apartment just minutes from Stanford campus. Features modern appliances, in-unit laundry, and a beautiful view of the campus. Perfect for graduate students.',
    price: 3200,
    room_type: 'entire' as const,
    bedrooms: 2,
    bathrooms: 2,
    address_line1: '321 Stanford Way',
    city: 'Stanford',
    state: 'CA',
    postal_code: '94305',
    campus_slug: 'stanford-university',
    amenities: ['wifi', 'laundry', 'parking', 'gym', 'furnished'],
    photos: [
      'https://images.unsplash.com/photo-1574320924047-ee3cf2a5beea?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
    ]
  },
  {
    title: 'Berkeley Hills Studio',
    description: 'Charming studio in the Berkeley Hills with stunning bay views. Walking distance to UC Berkeley campus via campus shuttle. Quiet neighborhood perfect for studying.',
    price: 2800,
    room_type: 'entire' as const,
    bedrooms: 1,
    bathrooms: 1,
    address_line1: '654 Hill Drive',
    city: 'Berkeley',
    state: 'CA',
    postal_code: '94708',
    campus_slug: 'uc-berkeley',
    amenities: ['wifi', 'parking', 'furnished', 'utilities_included'],
    photos: [
      'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
    ]
  },
  {
    title: 'Greenwich Village Apartment Near NYU',
    description: 'Classic NYC apartment in the heart of Greenwich Village. Just blocks from NYU campus, restaurants, and nightlife. Exposed brick walls and hardwood floors.',
    price: 4200,
    room_type: 'private' as const,
    bedrooms: 3,
    bathrooms: 2,
    address_line1: '123 Bleecker Street',
    address_line2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    postal_code: '10012',
    campus_slug: 'nyu',
    amenities: ['wifi', 'laundry', 'utilities_included'],
    photos: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80',
      'https://images.unsplash.com/photo-1574320924047-ee3cf2a5beea?w=800&q=80'
    ]
  }
];

const SAMPLE_USERS = [
  {
    email: 'sarah.johnson@student.harvard.edu',
    full_name: 'Sarah Johnson',
    school_email: 'sarah.johnson@student.harvard.edu'
  },
  {
    email: 'mike.chen@mit.edu', 
    full_name: 'Mike Chen',
    school_email: 'mike.chen@mit.edu'
  },
  {
    email: 'emily.davis@bu.edu',
    full_name: 'Emily Davis',
    school_email: 'emily.davis@bu.edu'
  },
  {
    email: 'alex.rodriguez@stanford.edu',
    full_name: 'Alex Rodriguez', 
    school_email: 'alex.rodriguez@stanford.edu'
  },
  {
    email: 'jessica.wong@berkeley.edu',
    full_name: 'Jessica Wong',
    school_email: 'jessica.wong@berkeley.edu'
  }
];

class DatabaseSeeder {
  private supabase: ReturnType<typeof createClient<Database>>;

  constructor() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required Supabase environment variables');
    }

    this.supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);
  }

  async seedCampuses() {
    console.log('🏫 Seeding campuses...');
    
    const { data, error } = await this.supabase
      .from('campuses')
      .insert(SAMPLE_CAMPUSES)
      .select();
      
    if (error) {
      console.error('Error seeding campuses:', error);
      throw error;
    }
    
    console.log(`✅ Created ${data.length} campuses`);
    return data;
  }

  async seedUsers() {
    console.log('👥 Seeding users...');
    
    const users = [];
    for (const userData of SAMPLE_USERS) {
      // Create auth user
      const { data: authData, error: authError } = await this.supabase.auth.admin.createUser({
        email: userData.email,
        password: 'demo123456', // Demo password
        email_confirm: true
      });
      
      if (authError) {
        console.warn(`Warning: Could not create auth user ${userData.email}:`, authError.message);
        continue;
      }
      
      // Create profile
      const { data: profile, error: profileError } = await this.supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: userData.full_name,
          school_email: userData.school_email
        })
        .select()
        .single();
        
      if (profileError) {
        console.warn(`Warning: Could not create profile for ${userData.email}:`, profileError.message);
        continue;
      }
      
      users.push(profile);
    }
    
    console.log(`✅ Created ${users.length} users`);
    return users;
  }

  async seedListings(campuses: any[], users: any[]) {
    console.log('🏠 Seeding listings...');
    
    const listings = [];
    
    for (let i = 0; i < SAMPLE_LISTINGS.length; i++) {
      const listingData = SAMPLE_LISTINGS[i];
      const campus = campuses.find(c => c.slug === listingData.campus_slug);
      const user = users[i % users.length]; // Distribute listings among users
      
      if (!campus || !user) {
        console.warn(`Skipping listing ${listingData.title} - missing campus or user`);
        continue;
      }
      
      // Add some randomization to coordinates
      const lat = campus.lat + (Math.random() - 0.5) * 0.01;
      const lng = campus.lng + (Math.random() - 0.5) * 0.01;
      
      const { data: listing, error } = await this.supabase
        .from('listings')
        .insert({
          user_id: user.id,
          campus_id: campus.id,
          title: listingData.title,
          description: listingData.description,
          price: listingData.price,
          room_type: listingData.room_type,
          bedrooms: listingData.bedrooms,
          bathrooms: listingData.bathrooms,
          address_line1: listingData.address_line1,
          address_line2: listingData.address_line2,
          city: listingData.city,
          state: listingData.state,
          postal_code: listingData.postal_code,
          lat,
          lng,
          move_in: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date within 90 days
          move_out: new Date(Date.now() + (180 + Math.random() * 180) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6-12 months later
          amenities: listingData.amenities
        })
        .select()
        .single();
        
      if (error) {
        console.warn(`Error creating listing ${listingData.title}:`, error);
        continue;
      }
      
      // Add photos
      if (listingData.photos.length > 0) {
        const photoRecords = listingData.photos.map((url, index) => ({
          listing_id: listing.id,
          url,
          position: index
        }));
        
        const { error: photoError } = await this.supabase
          .from('listing_photos')
          .insert(photoRecords);
          
        if (photoError) {
          console.warn(`Error adding photos for ${listingData.title}:`, photoError);
        }
      }
      
      listings.push(listing);
    }
    
    console.log(`✅ Created ${listings.length} listings`);
    return listings;
  }

  async seedMessages(listings: any[], users: any[]) {
    console.log('💬 Seeding messages...');
    
    const threads = [];
    const messages = [];
    
    // Create some sample conversations
    for (let i = 0; i < Math.min(3, listings.length); i++) {
      const listing = listings[i];
      const buyer = users.find(u => u.id !== listing.user_id);
      
      if (!buyer) continue;
      
      // Create thread
      const { data: thread, error: threadError } = await this.supabase
        .from('message_threads')
        .insert({
          listing_id: listing.id,
          buyer_id: buyer.id,
          seller_id: listing.user_id
        })
        .select()
        .single();
        
      if (threadError) {
        console.warn(`Error creating thread for listing ${listing.title}:`, threadError);
        continue;
      }
      
      threads.push(thread);
      
      // Create sample messages
      const sampleMessages = [
        {
          sender_id: buyer.id,
          body: `Hi! I'm interested in your listing "${listing.title}". Is it still available?`
        },
        {
          sender_id: listing.user_id,
          body: `Yes, it's still available! Would you like to schedule a viewing?`
        },
        {
          sender_id: buyer.id,
          body: `That would be great! I'm free this weekend. What times work for you?`
        }
      ];
      
      for (let j = 0; j < sampleMessages.length; j++) {
        const messageData = sampleMessages[j];
        const sentAt = new Date(Date.now() - (sampleMessages.length - j) * 60 * 60 * 1000); // Spread messages over hours
        
        const { data: message, error: messageError } = await this.supabase
          .from('messages')
          .insert({
            thread_id: thread.id,
            sender_id: messageData.sender_id,
            body: messageData.body,
            sent_at: sentAt.toISOString()
          })
          .select()
          .single();
          
        if (messageError) {
          console.warn(`Error creating message:`, messageError);
          continue;
        }
        
        messages.push(message);
      }
    }
    
    console.log(`✅ Created ${threads.length} message threads with ${messages.length} messages`);
    return { threads, messages };
  }

  async clearDatabase() {
    console.log('🧹 Clearing existing data...');
    
    // Delete in reverse order of dependencies
    await this.supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('message_threads').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('listing_photos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('favorites').delete().neq('user_id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('listings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await this.supabase.from('campuses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log('✅ Database cleared');
  }

  async seed() {
    try {
      console.log('🌱 Starting database seeding...\n');
      
      await this.clearDatabase();
      
      const campuses = await this.seedCampuses();
      const users = await this.seedUsers(); 
      const listings = await this.seedListings(campuses, users);
      await this.seedMessages(listings, users);
      
      console.log('\n🎉 Database seeding completed successfully!');
      console.log(`
📊 Summary:
- ${campuses.length} campuses
- ${users.length} users  
- ${listings.length} listings
- Sample message conversations created

🔗 You can now:
- Browse listings at /search
- Create an account and list your place
- Test the messaging system
- View the interactive map with real data
      `);
      
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    }
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  const seeder = new DatabaseSeeder();
  seeder.seed();
}

export { DatabaseSeeder };
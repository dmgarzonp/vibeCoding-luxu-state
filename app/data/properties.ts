export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  type: 'House' | 'Apartment' | 'Villa' | 'Penthouse';
  beds: number;
  baths: number;
  sqm: number;
  image: string;
  isExclusive?: boolean;
  isNew?: boolean;
  status: 'FOR SALE' | 'FOR RENT';
}

export const featuredProperties: Property[] = [
  {
    id: 'f1',
    title: 'The Glass Pavilion',
    location: 'Beverly Hills, California',
    price: '$5,250,000',
    type: 'Villa',
    beds: 5,
    baths: 4.5,
    sqm: 4200,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
    isExclusive: true,
    status: 'FOR SALE',
  },
  {
    id: 'f2',
    title: 'Azure Heights Penthouse',
    location: 'Downtown, Vancouver',
    price: '$3,800,000',
    type: 'Penthouse',
    beds: 3,
    baths: 3,
    sqm: 2100,
    image: 'https://images.unsplash.com/photo-1600607687940-4e52723659a9?auto=format&fit=crop&q=80&w=800',
    isNew: true,
    status: 'FOR SALE',
  },
];

export const newProperties: Property[] = [
  {
    id: 'n1',
    title: 'Modern Family Home',
    location: '123 Pine St, Seattle',
    price: '$850,000',
    type: 'House',
    beds: 3,
    baths: 2,
    sqm: 120,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
    status: 'FOR SALE',
  },
  {
    id: 'n2',
    title: 'Urban Loft',
    location: '456 Elm Ave, Portland',
    price: '$3,200',
    type: 'Apartment',
    beds: 1,
    baths: 1,
    sqm: 85,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600',
    status: 'FOR RENT',
  },
  {
    id: 'n3',
    title: 'Highland Retreat',
    location: '789 Mountain Rd, Bend',
    price: '$620,000',
    type: 'House',
    beds: 2,
    baths: 2,
    sqm: 98,
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600',
    status: 'FOR SALE',
  },
  {
    id: 'n4',
    title: 'Sea View Penthouse',
    location: '321 Ocean Dr, Miami',
    price: '$4,500',
    type: 'Penthouse',
    beds: 3,
    baths: 3,
    sqm: 180,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=600',
    status: 'FOR RENT',
  },
];

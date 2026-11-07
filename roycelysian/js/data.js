/* Roycelysian — site content.
   Projects: taglines are carried over from the previous roycelysian.com.
   "scope" lists what Roycelysian actually delivered on each project — confirm before launch. */
window.RY = {
  contact: {
    email: 'hello@roycelysian.com',      // TO CONFIRM
    city: 'Amman, Jordan',
    instagram: 'https://instagram.com/',  // TO CONFIRM
    behance: 'https://behance.net/',      // TO CONFIRM
    linkedin: 'https://linkedin.com/'     // TO CONFIRM
  },

  hero: [
    { img: 'zeryab-arcade', caption: 'Zeryab Estates', place: 'Marrakech, Morocco' },
    { img: 'lazure-hall', caption: "Royal L'azure Resort", place: 'Neom, Saudi Arabia' },
    { img: 'nal-terrace', caption: 'Nal Vila', place: 'Ibiza, Spain' },
    { img: 'skyline-view', caption: 'The Skyline Residences', place: 'Amman, Jordan' },
    { img: 'riad-garden', caption: 'Riad Elhob', place: 'Marrakech, Morocco' }
  ],

  projects: [
    {
      slug: 'zeryab-estates',
      name: 'Zeryab Estates',
      place: 'Marrakech, Morocco',
      type: 'Private Estate',
      title: 'A Sanctuary of Elegance and Tranquility',
      line: 'Where art and symmetry define sophistication.',
      intro: 'Zeryab Estates is composed like a gallery: long arcades, carved cedar ceilings, and rooms where art and architecture keep the same quiet discipline. We approached it the way it was built, with patience, symmetry and an eye for the details that give a place its character.',
      scope: ['Architectural Photography', 'Interiors', 'Retouching & Colour Grading'],
      cover: 'zeryab-arcade',
      gallery: [
        { img: 'zeryab-arches', f: 'tall' },
        { img: 'zeryab-niche', f: 'tall' },
        { img: 'zeryab-ceiling', f: 'wide' },
        { img: 'zeryab-statue', f: 'center' }
      ]
    },
    {
      slug: 'riad-elhob',
      name: 'Riad Elhob',
      place: 'Marrakech, Morocco',
      type: 'Guest House',
      title: 'Elevating Property, Redefining Elegance',
      line: 'Capturing the essence of exclusivity.',
      intro: 'A guest house built around the stillness of its garden. Our work here was about atmosphere as much as architecture: the light across the pool at the end of the day, the weight of the salons, the sense of arriving somewhere private.',
      scope: ['Hospitality Photography', 'Interiors', 'Retouching & Colour Grading'],
      cover: 'riad-garden',
      gallery: [
        { img: 'riad-library', f: 'wide' },
        { img: 'riad-salon', f: 'wide' }
      ]
    },
    {
      slug: 'nal-vila',
      name: 'Nal Vila',
      place: 'Ibiza, Spain',
      type: 'Private Villa',
      title: 'Where Nature and Serenity Embrace Luxury',
      line: 'An intimate painting of modern life.',
      intro: 'On the hills of Ibiza, Nal Vila opens almost entirely to the landscape. We photographed it at the edges of the day, when the terraces, the water and the mountains settle into one palette.',
      scope: ['Architectural Photography', 'Lifestyle', 'Colour Grading'],
      cover: 'nal-terrace',
      gallery: [
        { img: 'nal-pool', f: 'wide' }
      ]
    },
    {
      slug: 'skyline-residences',
      name: 'The Skyline Residences',
      place: 'Amman, Jordan',
      type: 'Branded Residences · Serviced by W Amman',
      title: 'A View of Prestige, A Life of Refinement',
      line: 'Amman, seen from above.',
      intro: 'High above the city, the residences are defined by the view they frame. Our images place the interior and the skyline in the same composition, so the life inside and the city beyond read as one experience.',
      scope: ['Interior Photography', 'Lifestyle', 'Retouching'],
      cover: 'skyline-view',
      gallery: []
    },
    {
      slug: 'royal-lazure',
      name: "Royal L'azure Resort",
      place: 'Neom, Saudi Arabia',
      type: 'Resort',
      title: 'Capturing the Essence of Exclusivity',
      line: 'Symmetry, light and repose.',
      intro: 'Arches, reflections and a measured, almost ceremonial symmetry. We photographed the public spaces of the resort to hold that calm, letting the architecture set the rhythm of every frame.',
      scope: ['Hospitality Photography', 'Interiors', 'Retouching & Colour Grading'],
      cover: 'lazure-hall',
      gallery: [
        { img: 'lazure-salon', f: 'wide' }
      ]
    }
  ],

  expertise: [
    {
      n: '01', name: 'Photography & Film', slug: 'photography', img: 'riad-salon',
      lead: 'Editorial-standard imagery, built on light, composition, colour and the feeling of a place.',
      items: ['Architectural', 'Interiors & Exteriors', 'Hospitality', 'Commercial', 'Lifestyle', 'Aerial', 'Film', 'Retouching & Colour Grading']
    },
    {
      n: '02', name: 'Branding & Design', slug: 'branding', img: 'zeryab-ceiling',
      lead: 'Identities that express the character of a brand or a place, carried through every point of contact, including the space itself.',
      items: ['Brand Strategy', 'Naming', 'Visual Identity', 'Art Direction', 'Signage & Wayfinding', 'Brand Applications', 'Print & Digital Design']
    },
    {
      n: '03', name: 'Editorial Publishing', slug: 'publishing', img: 'zeryab-niche',
      lead: 'Bespoke books and publications that hold the identity, character and detail of their subject.',
      items: ['Coffee Table Books', 'Architectural Monographs', 'Property Books', 'Brand Books', "Collector's Editions"]
    }
  ]
};

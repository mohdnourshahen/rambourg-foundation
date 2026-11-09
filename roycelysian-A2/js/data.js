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
    { img: 'zeryab-pool', caption: 'Zeryab Estates', place: 'Marrakech, Morocco' },
    { img: 'lazure-hall', caption: "Royal L'Azure Resort", place: 'Tabuk, Saudi Arabia' },
    { img: 'nal-terrace', caption: 'Nal Vila', place: 'Ibiza, Spain' },
    { img: 'skyline-view', caption: 'The Skyline Residences', place: 'Amman, Jordan' },
    { img: 'riad-garden', caption: 'Riad Elhob', place: 'Marrakech, Morocco' }
  ],

  // home slideshow, in order
  slides: [
    { slug: 'zeryab-estates', imgs: ['zeryab-pool', 'zeryab-gate', 'zeryab-salon'] },
    { slug: 'royal-lazure', imgs: ['lazure-hall', 'lazure-salon'] },
    { slug: 'skyline-residences', imgs: ['skyline-living', 'skyline-dining', 'skyline-sofa'] },
    { slug: 'nal-vila', imgs: ['nal-terrace', 'nal-pool'] }
  ],

  projects: [
    {
      slug: 'zeryab-estates',
      name: 'Zeryab Estates',
      place: 'Marrakech, Morocco',
      type: 'Private Estate',
      title: 'A Sanctuary of Elegance and Tranquility',
      line: 'Where art and symmetry define sophistication.',
      intro: 'A private luxury retreat in Marrakech, where Andalusian, Berber and Arab culture meet in something singular. Long arcades, carved cedar, still water and rooms where art and architecture keep the same quiet discipline. We photographed the estate the way it was built, with patience and symmetry, and the brand identity was created in collaboration with Lōn Visuals.',
      scope: ['Architectural & Interior Photography', 'Retouching & Colour Grading', 'Brand Identity, with Lōn Visuals'],
      cover: 'zeryab-pool',
      card: 'zeryab-arcade',
      gallery: [
        { img: 'zeryab-gate', f: 'wide', alt: 'Terracotta entrance gate with a Moorish arch at Zeryab Estates, Marrakech' },
        { img: 'zeryab-arches', f: 'tall', alt: 'A long corridor of Moorish arches at Zeryab Estates' },
        { img: 'zeryab-niche', f: 'tall', alt: 'Portrait painting framed in a carved niche, Zeryab Estates' },
        { img: 'zeryab-salon', f: 'wide', alt: 'Salon with fireplace, sculpture and patterned rug at Zeryab Estates' },
        { img: 'zeryab-statue', f: 'tall', alt: 'Marble statue at the end of an arched gallery in evening light, Zeryab Estates' },
        { img: 'zeryab-ceiling', f: 'tall', alt: 'Hand-crafted cedar ceiling detail, Zeryab Estates' }
      ],
      brand: {
        partner: 'Lōn Visuals',
        link: 'https://lonvisuals.com/work/zeryab-estates',
        title: 'Heritage, <em>reimagined</em>',
        text: [
          'Alongside the photography, the identity of Zeryab Estates was developed in collaboration with Lōn Visuals. The brief called for an identity that could carry centuries of culture without collapsing under its weight, and speak to an international audience while staying rooted in its place.',
          'The mark brings together two of Morocco’s most enduring forms, the Moorish arch and the interlocking geometry of zellige, in one architectural emblem. A wide-tracked wordmark gives the name the presence of an inscription.'
        ],
        lead: { img: 'zb-painting', cap: 'The identity over a Moroccan heritage painting' },
        pair: [
          { img: 'zb-arches', cap: 'Inspiration · The Moorish arch' },
          { img: 'zb-zellige', cap: 'Inspiration · Zellige geometry' }
        ],
        paletteText: 'Six tones taken from Marrakech: the navy of tile shadow, the umber of cedarwood, the gold of brass lanterns, the tan of sun-dried clay, handmade terracotta and poured iron.',
        palette: ['#162930', '#544124', '#896A22', '#C8945B', '#6C2D1B', '#9E3A26'],
        textures: ['zb-terra', 'zb-teal', 'zb-gold'],
        craft: { img: 'zb-emboss', cap: 'Foil emboss on luxury paper' },
        objects: [
          { img: 'zb-towel', cap: 'Textiles' },
          { img: 'zb-diffuser', cap: 'Amenities' }
        ],
        close: { img: 'zb-interior', cap: 'The brand in its setting' },
        credits: [
          ['Photography', 'Roycelysian'],
          ['Brand Identity & Art Direction', 'Lōn Visuals'],
          ['Year', '2026']
        ]
      }
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
        { img: 'riad-library', f: 'wide', alt: 'Library and salon framed by a carved stucco arch, Marrakech' }
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
        { img: 'nal-pool', f: 'wide', alt: 'Infinity pool and palm tree at dusk, Nal Vila, Ibiza' }
      ]
    },
    {
      slug: 'skyline-residences',
      name: 'The Skyline Residences',
      place: 'Amman, Jordan',
      type: 'Branded Residences · Serviced by W Amman',
      client: 'Eagle Hills',
      title: 'A View of Prestige, A Life of Refinement',
      line: 'Amman, seen from above.',
      intro: 'High above the city, the residences are defined by the view they frame. For Eagle Hills, we photographed the interiors and the skyline as one composition, so the life inside and the city beyond read as a single experience: warm light, curated furniture and Amman stretching to the horizon.',
      scope: ['Interior & Lifestyle Photography', 'Retouching & Colour Grading'],
      cover: 'skyline-living',
      gallery: [
        { img: 'skyline-dining', f: 'wide', alt: 'Dining room with floor-to-ceiling windows over Amman, The Skyline Residences' },
        { img: 'skyline-sofa', f: 'half', alt: 'Living room with curved sofa and city views, The Skyline Residences, Amman' },
        { img: 'skyline-table', f: 'half', alt: 'Dining table set before a panoramic view of Amman' }
      ]
    },
    {
      slug: 'royal-lazure',
      name: "Royal L'Azure Resort",
      place: 'Tabuk, Saudi Arabia',
      type: "Resort · L'Azure Hospitality",
      title: 'Capturing the Essence of Exclusivity',
      line: 'Symmetry, light and repose on the Red Sea coast.',
      intro: "Royal L'Azure belongs to L'Azure Hospitality, a premium hotel group on the Saudi Red Sea coast. Arches, reflections and a measured, almost ceremonial symmetry: we photographed the resort's spaces to hold that calm, and the group's identity was created in collaboration with Lōn Visuals.",
      scope: ['Hospitality & Interior Photography', 'Retouching & Colour Grading', 'Brand Identity & Website, with Lōn Visuals'],
      cover: 'lazure-hall',
      gallery: [
        { img: 'lazure-salon', f: 'wide', alt: "Lounge with arched windows at Royal L'Azure Resort" }
      ],
      brand: {
        partner: 'Lōn Visuals',
        link: 'https://lonvisuals.com/work/lazure',
        title: 'Where the sea <em>meets luxury</em>',
        text: [
          "For L'Azure Hospitality, the group behind Royal L'Azure and Sharma Resort, the identity was developed in collaboration with Lōn Visuals: one system to evoke the calm of water, the warmth of sand and the depth of the sea.",
          'It is built around a fluid wave symbol that holds movement and calm at once, carried from embossed stationery and room keys to the welcome kit and the group’s website.'
        ],
        lead: { img: 'lz-coast', cap: 'The wordmark over the Red Sea coastline', r: '2.9/1' },
        pair: [
          { img: 'lz-lobby', cap: 'Lobby visual and room key cards', r: '16/10' },
          { img: 'lz-wave', cap: 'The wave symbol', r: '16/10' }
        ],
        paletteText: 'Dark blue against tan gold, deep water against warm sand, held together by a deeper navy, black and white.',
        palette: ['#506580', '#D8BA9E', '#3D506A', '#111111', '#F8F8F8'],
        craft: { img: 'lz-kit', cap: 'Welcome kit and amenities', r: '3/2' },
        objects: [
          { img: 'lz-cards', cap: 'Business cards', r: '4/3' },
          { img: 'lz-envelopes', cap: 'Stationery', r: '4/3' }
        ],
        extra: { img: 'lz-web', cap: 'lazurehospitality.com', r: '4/3' },
        credits: [
          ['Photography', 'Roycelysian'],
          ['Brand Identity & Website', 'Lōn Visuals'],
          ['Year', '2024']
        ]
      }
    }
  ],

  expertise: [
    {
      n: '01', name: 'Photography & Film', slug: 'photography', img: 'zeryab-salon',
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

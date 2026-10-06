// resources/js/mockData.js
import { Trees, Award, Users2, FileCheck, MapPin, TrendingUp, Clock, CircleCheck, TriangleAlert, Receipt, ShieldCheck, Cloud, RotateCcw, FileText, CreditCard, Mountain, CloudLightning, ShieldAlert, Users, Wallet, QrCode, Building2, Map, Phone, Leaf } from 'lucide-react';


import SabluyonRoute from '../../public/images/trail/SabluyonTrail.jpg';
import BalogoRoute from '../../public/images/trail/BalogoTrail.jpg';
import QR from '../../public/images/QR_Code_Example.svg.webp';
import mtMasaragaSummit from '../../public/images/about/mt-masaraga-summit.jpg';
import mtMasaragaCampsite from '../../public/images/about/mt-masaraga-campsite-3.jpg';
import mtMasaragaVanishingFalls from '../../public/images/about/mt-masaraga-vanishing-falls.jpg';
import mtMasaragaNaturalSpring from '../../public/images/about/mt-masaraga-natural-springs-trail.jpg';

// Demo dates are generated rather than hard-coded, so the booking flow always has
// climb dates to show no matter when the site is opened. A month offset of 0 is
// the current month, 1 the next one, -1 the previous one. Days past the end of a
// short month (e.g. 30 in February) clamp to that month's last day.
const DEMO_YEAR = new Date().getFullYear();

function dateInMonth(monthOffset, day) {
    const today = new Date();
    const year = today.getFullYear();
    const monthIndex = today.getMonth() + monthOffset;
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0).getDate();
    return new Date(year, monthIndex, Math.min(day, lastDayOfMonth));
}

export function monthDateKey(monthOffset, day) {
    const date = dateInMonth(monthOffset, day);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${dayOfMonth}`;
}

export function monthDateLabel(monthOffset, day) {
    return dateInMonth(monthOffset, day).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

// Sample Mock Database / Credentials List
export const MOCK_USERS = [
    {
        id: 'user_hiker',
        name: 'Jon Eric Tripulca',
        email: 'hiker@example.com',
        role: 3, // Role 3: User Hiker
        subtitle: 'Hiker',
        password: 'HIKER1',
    },
    {
        id: 'user_staff',
        name: 'Maria Santos',
        email: 'staff@masaraga.gov.ph',
        role: 2, // Role 2: Hiker Staff / Guide
        subtitle: 'Park Staff / Guide',
        password: 'STAFF1',

    },
    {
        id: 'user_admin',
        name: 'Juan Dela Cruz',
        email: 'admin@masaraga.gov.ph',
        role: 1, // Role 1: Admin
        subtitle: 'System Administrator',
        password: 'ADmin1',
        secondaryPin: '123456'
    },

];

export const AWARDS = [
    {
        id: 'denr-pamb-recognition-2023',
        iconKey: 'workspace_premium',
        badge: '2023 Recognition',
        title: 'DENR-PAMB Recognition',
        name: 'DENR-PAMB Recognition',
        awardingBody: 'DENR & Protected Area Management Board',
        dateReceived: 'December 15, 2023',
        category: 'Protected Landscape Management',
        summary: 'Awarded for outstanding management of protected landscapes in the Bicol Region (2023). Recognized by the Department of Environment and Natural Resources for habitat protection and biodiversity monitoring.',
        description: 'Awarded for outstanding management of protected landscapes in the Bicol Region (2023).',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeB3ZblugQwbPIF9ls2WH9qrKx3Gk9xggmUMyj_7LzQ5Fx9XMNEFWdsHrkf8t5Ze0VMqsE50ICiRY7d008yss-3VnkOmEPQSlB1t7ut3eh7PbK-a36MQUKh1ByJ7vcGX1HGiLEnuXsJJM5uoQo1kYZsb8guKFdM2D_CKFH6pczo5tjlvqU73c-kYl6uY5sXbaVq1F363CmLDrYLH53N6vZ_BNoycxJ51gTlRhW1FINe9CnEClq1rATjw',
        imageAlt: 'DENR-PAMB Environmental Excellence Plaque awarded to Mt. Masaraga',
        story: {
            title: 'Pioneering Protected Landscape Stewardship',
            paragraphs: [
                'The DENR-PAMB recognition marks a major milestone for the Mt. Masaraga Protected Landscape. Over the past several years, joint conservation efforts between local rangers and regional environmental units established stricter boundary monitoring to prevent illegal flora harvesting and encroachment.',
                'Through continuous forest patrol logging, community-led reforestation campaigns, and wildlife sanctuary designations, the park maintained peak forest canopy health while safely hosting thousands of outdoor enthusiasts across the Bicol Region.'
            ]
        },
        metrics: [
            {
                id: 'canopy',
                value: '98%',
                label: 'Protected Forest Canopy',
                icon: Trees
            },
            {
                id: 'patrols',
                value: '350+',
                label: 'Annual Ranger Patrols',
                icon: ShieldCheck
            }
        ]
    },
    {
        id: 'eco-tourism-excellence',
        iconKey: 'eco',
        badge: 'National Certification',
        title: 'Eco-Tourism Excellence',
        name: 'Eco-Tourism Excellence',
        awardingBody: 'National Ecotourism Steering Committee',
        dateReceived: 'August 20, 2024',
        category: 'Sustainable Ecotourism Destination',
        summary: 'Certified Sustainable Destination by the National Ecotourism Steering Committee. Honored for zero-waste trail management, mandatory guide deployment, and sustainable community livelihood integration.',
        description: 'Certified Sustainable Destination by the National Ecotourism Steering Committee.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBx58jMKv8xlkDEyNHDKNiXJjYn0NidutYK_dDbexJKelvXUpFsVpmDwTt8Q5tP5wXx6Rn76iZxLCxnVqGAq2XKx53JtHvz3CHpRc3Q3P9jw4RhB9nbG3a9hBSv-aI19vhUl7mDuP1EXDzPpQ1G0w-hH8a--Iczrmi2tszKoSJovleF2bGjWQDxmOp0mywUZVyPEuLW3L_aGmSY_oCikOS1GbFHYfdnM4ayp917gqttM2U9k3AkxKG7Pw',
        imageAlt: 'Sustainable Eco-Tourism Excellence certificate presented to Mt. Masaraga office',
        story: {
            title: 'Community-Led Sustainable Tourism',
            paragraphs: [
                'Ecotourism excellence was achieved by shifting park policies toward direct community engagement. Every hike conducted on Mt. Masaraga directly supports accredited local guides, porter networks, and nearby barangay eco-initiatives.',
                'Our strict "Leave No Trace" check-in policy requires hikers to declare all single-use plastics before entering the trailheads. This initiative successfully eliminated solid waste build-up along peak summit trails.'
            ]
        },
        metrics: [
            {
                id: 'waste',
                value: '0%',
                label: 'Trail Waste Tolerance',
                icon: Leaf
            },
            {
                id: 'guides',
                value: '120+',
                label: 'Local Guides Employed',
                icon: Users2
            }
        ]
    },
    {
        id: 'iso-14001-certified',
        iconKey: 'verified_user',
        badge: 'Global Compliance',
        title: 'ISO 14001 Certified',
        name: 'ISO 14001 Certified',
        awardingBody: 'International Organization for Standardization',
        dateReceived: 'May 10, 2024',
        category: 'Environmental Management System',
        summary: 'International standard for effective environmental management systems. Certified for rigorous risk mitigation, trail erosion control, and sustainable resource allocation.',
        description: 'International standard for effective environmental management systems.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO915Ka3cjQMZlDZw0OEVZwbJpI-YctaQy8GlwTDNw0NdRjMpB9XNKqnVGuCw8fZnNG6osqoV8Y7iKbSCd9bDTg_-qY0gnOOQPpJt64yB3l_XB18b6WtaUm44AkWAOp1n9NQIge83u-zMcQ3vbSWjumtiS4JkAQc2jh50VEPIXUM0giQGq-pimE4eacDuLJD0mDDgqpUZnG4jNPtmXRNhpImJr3fuXHiNxk5THrVtbLySptu2TZ_pJRA',
        imageAlt: 'ISO 14001 Environmental System audit documentation at park headquarters',
        story: {
            title: 'International Environmental Standards',
            paragraphs: [
                'Achieving ISO 14001 certification required auditing every operational process within the protected area. From digital permit processing to emergency evacuation readiness, our administrative infrastructure meets international standards.',
                'This certification guarantees that all trail maintenance, summit access caps, and environmental assessments are systematically logged, reviewed, and updated annually to minimize ecological footprints.'
            ]
        },
        metrics: [
            {
                id: 'compliance',
                value: '100%',
                label: 'Audit Standard Met',
                icon: FileCheck
            },
            {
                id: 'standard',
                value: 'ISO 14001',
                label: 'Global Standard',
                icon: Award
            }
        ]
    }
];

export const ICON_PATHS = {
    workspace_premium: 'M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2z',
    eco: 'M22 5v2h-3v3h-2V7h-3V5h3V2h2v3h3zm-6.5 7.5C16 15 14 17 10.5 17 8 17 5 14 5 11.5 5 8 7 6 9.5 6c3.5 0 5 3.5 6 6.5zM2 22c0-5 3-8.5 8-10.5C6 13 4 16 2 22z',
    verified_user: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z',
};

export const EXPERIENCES = [
    {
        initials: 'ES',
        name: 'Elena Santos',
        quote:
            'The summit view was breathtaking! A challenging climb but the panoramic views of Bicol are worth every step.',
        rating: 4.5,
    },
    {
        initials: 'MC',
        name: 'Marcus Chen',
        quote:
            'Well-maintained trails and friendly guides. The permit process was smooth and the safety briefing was very thorough.',
        rating: 5,
    },
    {
        initials: 'SJ',
        name: 'Sarah Johnson',
        quote:
            'The Eco-Trail Loop was perfect for my family. My kids loved seeing the rare birds and learning about local plants.',
        rating: 4,
    },
];

export const TRAILS = {
    amtic: {
        id: 'amtic',
        name: 'Sabluyon Trail',
        difficulty: 'Major Climb',
        difficultyClass: 'bg-primary-container text-on-primary-container',
        trailClass: 'Class 3 - Technical Scramble',
        technicality: 'High (Rope sections, exposed ridges)',
        description:
            'The primary and most established route up Mt. Masaraga, starting at Sitio Sabluyon, Brgy. Amtic, Ligao City. Known for its relentless steep inclines, dense jungle canopy, and technical rope-assisted ridge assault leading to the summit.',
        statIcon: 'height',
        stats: [
            { id: 'elevation', value: "1,328m" },
            { id: 'difficulty', value: "7/9" },
            { id: 'duration', value: "8-10h" },
            { id: 'distance', value: "9.2km" }
        ],
        image: SabluyonRoute,
        subtitle: 'Continuous steep assault through tropical rain forest and technical mossy ridgelines.',
        waypoints: [
            { name: 'Sitio Sabluyon Jump-off', description: 'Registration, guide assignment & safety briefing', icon: 'start' },
            { name: 'Camp 1 (Bamboos)', description: 'First rest area near lower stream', icon: 'camp' },
            { name: 'Camp 2 (Assault Base)', description: 'Staging ground before steep ridge climb', icon: 'camp' },
            { name: 'Mt. Masaraga Summit', description: '360° view of Mayon Volcano and Albay Gulf', icon: 'summit' },
        ],
        elevationPoints: [
            { label: 'Sabluyon Base', elevation: '220m', x: 70, y: 260 },
            { label: 'Amintao Rest Stop', elevation: '580m', x: 220, y: 195 },
            { label: 'Fixed Ropes Pitch', elevation: '920m', x: 390, y: 140 },
            { label: 'Mossy Forest Spine', elevation: '1,180m', x: 530, y: 95 },
            { label: 'Masaraga Peak', elevation: '1,328m', x: 660, y: 35, isSummit: true },
        ],
        paragraphs: [
            'The Amtic Trail serves as the official, standard route to the summit of Mt. Masaraga. Commencing at Sitio Sabluyon in Barangay Amtic, Ligao City, the trail immediately engages hikers with sustained uphill gradients through dense dipterocarp forest before transitioning into steep, razor-back ridges.',
            'Requires strong physical conditioning and surefootedness. Climbers negotiate exposed roots, loose volcanic soil, and several vertical pitches equipped with fixed ropes. The high canopy shelters diverse wildlife, leading up to an unshaded peak offering an unobstructed panorama of Mayon Volcano, Mt. Malinao, and the surrounding Albay plains.',
        ],
        highlights: [
            { id: 'flora-fauna', label: 'Flora & Fauna:', description: 'Home to Nepenthes pitcher plants, wild orchids, endemic Rufous Hornbills, and Philippine Macaques.' },
            { id: 'water-sources', label: 'Water Sources:', description: 'Last reliable water source is located near Camp 1 (Seasonal stream). Filtration mandatory.' },
            { id: 'campsites', label: 'Campsites:', description: 'Limited summit space fits 4-5 tents. Base camp at Camp 2 offers better wind shelter.' },
        ],
        gallery: [
            { id: 1, src: mtMasaragaSummit, alt: "Hikers negotiating steep dirt trail shaded by thick jungle tree cover", title: "Trail Assault", subtitle: "Near the point elevation trail" },
            { id: 2, src: mtMasaragaCampsite, alt: "Dense mossy branches and ferns along high altitude ridge line", title: "Campsite", subtitle: "The Mt. Masaraga Campsite" },
            { id: 3, src: mtMasaragaVanishingFalls, alt: "Overlook of Albay plains and Mayon Volcano from Masaraga summit", title: "Vanishing Falls", subtitle: "The Vanishing Falls of MT. Masaraga" },
            { id: 4, src: mtMasaragaNaturalSpring, alt: "Freshwater stream flowing over rocks along lower trail", title: "Sabluyon Spring", subtitle: "Mid-way hydration point" },
        ],
        reviews: [
            { id: 1, initials: 'ES', name: 'Elena Santos', quote: 'A brutal pure-assault climb! The rope sections tested our grip, but standing at the summit with Mayon in full view was surreal.', date: 'Oct 12, 2024', rating: 5 },
            { id: 2, initials: 'MC', name: 'Marcus Chen', quote: 'Strenuous hike with zero flat sections. Excellent PAMB local guides who kept our pace safe through the mossy ridge.', date: 'Sep 28, 2024', rating: 5 },
            { id: 3, initials: 'SJ', name: 'Sarah Johnson', quote: 'Trail is technical and slippery when wet. Bring gloves for the rope segments and plenty of water!', date: 'Sep 15, 2024', rating: 4 },
            { id: 4, initials: 'RV', name: 'Ramon Valdez', quote: 'Challenging day-climb. Completed in 9 hours total. The forest cover keeps you cool until the final ridge assault.', date: 'Aug 30, 2024', rating: 4.5 },
            { id: 5, initials: 'AL', name: 'Anna Lopez', quote: 'Top-tier adventure in Albay. The pitcher plants near the top were amazing to see in their natural habitat.', date: 'Aug 14, 2024', rating: 5 },
        ],
    },
    ligao: {
        id: 'ligao',
        name: 'Balogo Trail',
        difficulty: 'Moderate-Major',
        difficultyClass: 'bg-primary text-white',
        trailClass: 'Class 2 - Steep Hiking',
        technicality: 'Moderate (Steep sections, some exposed roots)',
        description:
            'A scenic alternative route initiating near Brgy. Balogo East. This path winds through quiet agricultural farmlands and open cogon grasslands before merging into the forested upper slopes of Mt. Masaraga.',
        statIcon: 'nature',
        stats: [
            { id: 'elevation', value: "1,328m" },
            { id: 'difficulty', value: "5/9" },
            { id: 'duration', value: "7-9h" },
            { id: 'distance', value: "8.1km" }
        ],
        image: BalogoRoute,
        subtitle: 'A balanced route blending agricultural countryside paths with forested ridgelines.',
        waypoints: [
            { name: 'Brgy. Balogo Jump-off', description: 'Logbook sign-in & guide briefing', icon: 'start' },
            { name: 'Coconut Plantation Gate', description: 'Gentle incline through local farmlands', icon: 'camp' },
            { name: 'Balogo Ridge Viewpoint', description: 'Open clearing facing Ligao City valleys', icon: 'camp' },
            { name: 'Mt. Masaraga Summit', description: 'Peak junction with 360° panorama', icon: 'summit' },
        ],
        elevationPoints: [
            { label: 'Balogo Elementary', elevation: '280m', x: 70, y: 255 },
            { label: 'Coconut Grove', elevation: '520m', x: 220, y: 200 },
            { label: 'Cogon Ridgeline', elevation: '810m', x: 390, y: 150 },
            { label: 'High Junction', elevation: '1,050m', x: 530, y: 100 },
            { label: 'Masaraga Peak', elevation: '1,328m', x: 660, y: 35, isSummit: true },
        ],
        paragraphs: [
            'The Balogo Trail presents a varied landscape trek starting from the eastern foothills of Ligao. Hikers traverse coconut groves, small mountain communities, and open brushlands, gaining steady elevation before entering the rainforest zone near the mid-way point.',
            'Although offering a slightly more gradual start than the Amtic route, the trail merges into steep terrain near the upper ridge. Sun protection is essential during the early stages due to open plantation stretches, while the upper section requires careful footwork over exposed roots and rocky ledges.',
        ],
        highlights: [
            { id: 'flora-fauna', label: 'Flora & Fauna:', description: 'Abundant wild orchids, tree ferns, fruit bats, and native songbirds along the forest boundary.' },
            { id: 'water-sources', label: 'Water Sources:', description: 'No reliable water sources along the open ridge. Carry minimum 3L of water per person.' },
            { id: 'campsites', label: 'Campsites:', description: 'Shaded resting spots available at Coconut Grove. No established camping on open ridges.' },
        ],
        gallery: [
            { id: 1, src: mtMasaragaSummit, alt: "Path passing through open coconut fields toward mountain base", title: "Farmland Approach", subtitle: "Balogo lower trail section" },
            { id: 2, src: mtMasaragaCampsite, alt: "Open ridge trail surrounded by tall cogon grass and distant hills", title: "Balogo Ridgeline", subtitle: "Mid-trail observation area" },
            { id: 3, src: mtMasaragaVanishingFalls, alt: "High altitude vantage point showing surrounding Albay landscape", title: "Valley Overlook", subtitle: "Upper ridge viewpoint" },
            { id: 4, src: mtMasaragaNaturalSpring, alt: "Shaded rest station under rainforest canopy", title: "Forest Junction", subtitle: "Upper trail canopy zone" },
        ],
        reviews: [
            { id: 1, initials: 'JM', name: 'Jayson Mendoza', quote: 'Great alternative to Amtic! The initial walk through the farmlands was pleasant before we hit the steep forest trail.', date: 'Nov 04, 2024', rating: 5 },
            { id: 2, initials: 'KL', name: 'Kristine Lim', quote: 'Start early to beat the heat on the open plantation sections. Gorgeous views of the valley as you gain height!', date: 'Oct 19, 2024', rating: 4.5 },
            { id: 3, initials: 'DR', name: 'Danilo Reyes', quote: 'Well-marked trail guided by local Balogo rangers. A bit muddy near the high junction, but manageable.', date: 'Sep 02, 2024', rating: 4 },
            { id: 4, initials: 'CP', name: 'Clara Pascual', quote: 'Less crowded route with wonderful countryside scenery. Highly recommended for experienced day hikers!', date: 'Aug 22, 2024', rating: 5 },
            { id: 5, initials: 'BT', name: 'Ben Torres', quote: 'Challenging yet rewarding trek. Make sure to bring enough water as there are no streams along this ridge.', date: 'Jul 11, 2024', rating: 4.5 },
        ],
    },
};

// Published climb schedules per trail. Each row is one date the park has
// opened for booking: capacity (slots), how many are taken, and the assigned
// guide. The hiker-facing booking calendar reads these to decide which dates
// are selectable, so the rows are generated from the current month (offset 0)
// and the next one (offset 1) instead of being pinned to fixed dates. status
// mirrors the remaining slots: Available, Limited, or Full.
const SCHEDULE_SEED = [
    { trailId: 'amtic', monthOffset: 0, day: 5, capacity: 20, booked: 8, guide: 'Rodel Villanueva', status: 'Available' },
    { trailId: 'amtic', monthOffset: 0, day: 6, capacity: 20, booked: 12, guide: 'Maria Santos', status: 'Available' },
    { trailId: 'amtic', monthOffset: 0, day: 7, capacity: 20, booked: 20, guide: 'Jose Reyes', status: 'Full' },
    { trailId: 'amtic', monthOffset: 0, day: 8, capacity: 20, booked: 18, guide: 'Ana Delos Santos', status: 'Limited' },
    { trailId: 'amtic', monthOffset: 0, day: 9, capacity: 20, booked: 5, guide: 'Paolo Cruz', status: 'Available' },
    { trailId: 'amtic', monthOffset: 0, day: 10, capacity: 20, booked: 20, guide: 'Ramon Valdez', status: 'Full' },
    { trailId: 'amtic', monthOffset: 0, day: 24, capacity: 50, booked: 44, guide: 'Rodel Villanueva', status: 'Limited' },
    { trailId: 'ligao', monthOffset: 0, day: 7, capacity: 15, booked: 15, guide: 'Ana Delos Santos', status: 'Full' },
    { trailId: 'ligao', monthOffset: 0, day: 8, capacity: 15, booked: 14, guide: 'Paolo Cruz', status: 'Limited' },
    { trailId: 'ligao', monthOffset: 0, day: 9, capacity: 15, booked: 9, guide: 'Ramon Valdez', status: 'Available' },
    { trailId: 'ligao', monthOffset: 0, day: 10, capacity: 15, booked: 15, guide: 'Rodel Villanueva', status: 'Full' },
    { trailId: 'ligao', monthOffset: 0, day: 24, capacity: 30, booked: 11, guide: 'Maria Santos', status: 'Available' },
    // Next month's opening slots, so the booking calendar always offers a climb
    // beyond the current month.
    { trailId: 'ligao', monthOffset: 1, day: 28, capacity: 15, booked: 11, guide: 'Maria Santos', status: 'Available' },
    { trailId: 'ligao', monthOffset: 1, day: 30, capacity: 15, booked: 10, guide: 'Jose Reyes', status: 'Available' },
    // Last month's completed climb, kept for the archived booking record.
    { trailId: 'ligao', monthOffset: -1, day: 12, capacity: 30, booked: 1, guide: 'Jose Reyes', status: 'Full' },
];

export const ADMIN_SCHEDULES = SCHEDULE_SEED
    .map(({ monthOffset, day, trailId, capacity, booked, guide, status }) => {
        const dateKey = monthDateKey(monthOffset, day);
        return {
            id: `sch-${trailId}-${dateKey}`,
            trailId,
            trail: TRAILS[trailId].name,
            date: monthDateLabel(monthOffset, day),
            dateKey,
            capacity,
            booked,
            guide,
            status,
        };
    })
    // A short month can collapse two seeded days onto one date (day 28 and day
    // 30 both fall on Feb 28), which would duplicate a schedule id. Keep the first.
    .filter((schedule, index, list) => list.findIndex((other) => other.id === schedule.id) === index);

function scheduleAt(trailId, monthOffset, day) {
    return ADMIN_SCHEDULES.find((schedule) => schedule.id === `sch-${trailId}-${monthDateKey(monthOffset, day)}`);
}

// The 24th of the current month is the park's headline climb day: the seeded
// bookings and the daily quota below both hang off it.
const AMTIC_HIKE_DAY = scheduleAt('amtic', 0, 24);
const LIGAO_HIKE_DAY = scheduleAt('ligao', 0, 24);
const LIGAO_PAST_HIKE_DAY = scheduleAt('ligao', -1, 12);

export const ADMIN_OPERATIONAL_DATE = AMTIC_HIKE_DAY.dateKey;

export const GALLERY_ITEMS = [
    {
        src: '/images/gallery/morning-mist.jpg',
        alt: "Mt. Masaraga's peak shrouded in soft morning mist",
        caption: 'Morning Mist over Mt. Masaraga',
    },
    {
        src: '/images/gallery/Spilornis-holospilus.jpg',
        alt: 'Spilornis holospilus',
        caption: 'Spilornis holospilus',
    },
    {
        src: '/images/gallery/boardwalk.jpg',
        alt: 'Hikers on wooden boardwalk trail',
        caption: 'Protected Canopy Boardwalk',
    },
    {
        src: '/images/gallery/mt-masaraga-vanishing-falls.jpg',
        alt: 'Mt. Masaraga Vanishing Falls',
        caption: 'Mt. Masaraga Vanishing Falls',
    },
    {
        src: '/images/gallery/rafflesia-lagascae.jpg',
        alt: 'Rafflesia lagascae',
        caption: 'Rafflesia lagascae',
    },
    {
        src: '/images/gallery/cloud-forest.jpg',
        alt: 'Lush green ferns and moss-covered forest',
        caption: 'Ancient Cloud Forest Canopy',
    },
    {
        src: '/images/gallery/gonocephalus-sophiae.jpg',
        alt: 'Gonocephalus sophiae',
        caption: 'Gonocephalus sophiae',
    },
    {
        src: '/images/gallery/loriculus-philippensis.jpg',
        alt: 'Loriculus philippensis',
        caption: 'Loriculus philippensis',
    },
    {
        src: '/images/gallery/mt-masaraga-campsite-3.jpg',
        alt: 'Mt. Masaraga Campsite',
        caption: 'Mt. Masaraga Campsite',
    },
    {
        src: '/images/gallery/trimeresurus-flavomaculatus.jpg',
        alt: 'Trimeresurus flavomaculatus',
        caption: 'Trimeresurus flavomaculatus',
    }
];

export const NEWS = [
    {
        id: 'scheduled-trail-maintenance',
        category: 'Advisory',
        badgeClass: 'bg-red-50 text-red-700 border-red-200',
        date: 'Oct 24, 2024',
        title: 'Scheduled Trail Maintenance',
        leadParagraph: 'The Eco-Trail Loop will be partially closed for boardwalk repairs from Oct 28-30. Please review the impacted sections and safety guidelines.',
        leadImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBx58jMKv8xlkDEyNHDKNiXJjYn0NidutYK_dDbexJKelvXUpFsVpmDwTt8Q5tP5wXx6Rn76iZxLCxnVqGAq2XKx53JtHvz3CHpRc3Q3P9jw4RhB9nbG3a9hBSv-aI19vhUl7mDuP1EXDzPpQ1G0w-hH8a--Iczrmi2tszKoSJovleF2bGjWQDxmOp0mywUZVyPEuLW3L_aGmSY_oCikOS1GbFHYfdnM4ayp917gqttM2U9k3AkxKG7Pw',
        leadImageAlt: 'Trail maintenance team replacing wooden boardwalk footings in green forest',
        sections: [
            {
                type: 'paragraph',
                text: 'The Mt. Masaraga Park Maintenance Team will conduct scheduled repairs on the Eco-Trail Loop to replace weathered wooden planks and reinforce trail safety barriers.'
            },
            {
                type: 'heading',
                text: 'Closure Details & Schedule'
            },
            {
                type: 'paragraph',
                text: 'Work will begin promptly on October 28 and is scheduled to wrap up on October 30. During this window, specific trail zones will be restricted:'
            },
            {
                type: 'list',
                items: [
                    { label: 'Oct 28 - Oct 29', text: 'Eco-Trail Lower Loop & Wooden Boardwalk Section' },
                    { label: 'Oct 30', text: 'Final Inspection & Reopening of Lower Junction' }
                ]
            },
            {
                type: 'heading',
                text: 'Recommended Detours'
            },
            {
                type: 'paragraph',
                text: 'Hikers planning trips during these dates should use the Ridge Trail connection as an alternative route to access the upper summit paths.'
            }
        ],
        contact: {
            phone: '+63 917-EMS-SAFE',
            email: 'support@masaraga.gov.ph'
        }
    },
    {
        id: 'favorable-climbing-conditions',
        category: 'Weather',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        date: 'Oct 23, 2024',
        title: 'Favorable Climbing Conditions',
        leadParagraph: 'Clear skies expected for the weekend. Perfect conditions for the Standard Summit trail with low humidity and high visibility.',
        leadImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJs6fNWag19aRj8sSThWOMTqvKHld5c3vP9m0JAIkbonWysDMux17Zyhz5NMxkPCLo-qmLST2YTWOo2V77vbcJdsLJGJ4cm47esAqBjlUu2VmIrNHF-ZPkTEPv1HZIi2PgQlPTF72NFmwiM2ggKEJ-bFbxh2TDcvk_JFlbYqjDmjlVDn7N6ei9yBoslECA0K65EapHSgcTMl-elU89nmF-TFJoBcHOjK7p3doeIwes8ptV4X99S80cZA',
        leadImageAlt: 'Sunlit mountain peak under clear blue sky with crisp trail visibility',
        sections: [
            {
                type: 'paragraph',
                text: 'The local meteorological station reports stable high-pressure systems moving across the region, bringing ideal hiking weather for Mt. Masaraga throughout the upcoming weekend.'
            },
            {
                type: 'heading',
                text: 'Weekend Forecast Overview'
            },
            {
                type: 'paragraph',
                text: 'Hikers can expect optimal trail conditions across all main ascent routes:'
            },
            {
                type: 'list',
                items: [
                    { label: 'Temperature', text: 'Comfortable 22°C - 27°C during peak daytime hours' },
                    { label: 'Wind & Visibility', text: 'Light breezes under 10 km/h with clear cloudless views at the peak' }
                ]
            },
            {
                type: 'heading',
                text: 'Preparation Checklist'
            },
            {
                type: 'paragraph',
                text: 'While conditions are clear, temperatures remain cool near the summit during early morning hours. Pack adequate hydration, sun protection, and a light jacket.'
            }
        ],
        contact: {
            phone: '+63 (052) 555-0198',
            email: 'ranger.station@masaraga.gov'
        }
    },
    {
        id: 'new-online-permit-system',
        category: 'Update',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        date: 'Oct 20, 2024',
        title: 'New Online Permit System',
        leadParagraph: 'We have upgraded our booking portal for faster processing of climbing permits, digital QR pass issuance, and instant guide allocations.',
        leadImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO915Ka3cjQMZlDZw0OEVZwbJpI-YctaQy8GlwTDNw0NdRjMpB9XNKqnVGuCw8fZnNG6osqoV8Y7iKbSCd9bDTg_-qY0gnOOQPpJt64yB3l_XB18b6WtaUm44AkWAOp1n9NQIge83u-zMcQ3vbSWjumtiS4JkAQc2jh50VEPIXUM0giQGq-pimE4eacDuLJD0mDDgqpUZnG4jNPtmXRNhpImJr3fuXHiNxk5THrVtbLySptu2TZ_pJRA',
        leadImageAlt: 'Digital permit verification screen displayed on a mobile tablet at ranger station',
        sections: [
            {
                type: 'paragraph',
                text: 'In our commitment to digital modernization and seamless visitor management, the Mt. Masaraga Protected Landscape Management Office has launched an upgraded Online Permit Portal.'
            },
            {
                type: 'heading',
                text: 'Key Enhancements'
            },
            {
                type: 'paragraph',
                text: 'The new system streamlined several core registration steps:'
            },
            {
                type: 'list',
                items: [
                    { label: 'Instant Approval', text: 'Automated document verification for standard permits' },
                    { label: 'Digital E-Passes', text: 'Downloadable QR-coded tickets sent directly to mobile' },
                    { label: 'Online Payments', text: 'Integrated e-wallet payment methods including GCash and Maya' }
                ]
            },
            {
                type: 'heading',
                text: 'How to Book'
            },
            {
                type: 'paragraph',
                text: 'Hikers can visit the main navigation menu, select "Book New Hike", choose an available calendar slot, and complete payment within minutes.'
            }
        ],
        contact: {
            phone: '+63 (052) 555-0198',
            email: 'ranger.station@masaraga.gov'
        }
    }
];

export const RELATED_UPDATES = [
    {
        id: 'news-1',
        category: 'News',
        date: 'Oct 05',
        title: 'New Rest Stations Completed at Camp 1',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJs6fNWag19aRj8sSThWOMTqvKHld5c3vP9m0JAIkbonWysDMux17Zyhz5NMxkPCLo-qmLST2YTWOo2V77vbcJdsLJGJ4cm47esAqBjlUu2VmIrNHF-ZPkTEPv1HZIi2PgQlPTF72NFmwiM2ggKEJ-bFbxh2TDcvk_JFlbYqjDmjlVDn7N6ei9yBoslECA0K65EapHSgcTMl-elU89nmF-TFJoBcHOjK7p3doeIwes8ptV4X99S80cZA',
        alt: 'Close-up view of freshly cleared hiking trail section with wooden steps'
    },
    {
        id: 'news-2',
        category: 'Advisory',
        date: 'Sep 28',
        title: 'Mandatory Guide Policy Update for Q4',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO915Ka3cjQMZlDZw0OEVZwbJpI-YctaQy8GlwTDNw0NdRjMpB9XNKqnVGuCw8fZnNG6osqoV8Y7iKbSCd9bDTg_-qY0gnOOQPpJt64yB3l_XB18b6WtaUm44AkWAOp1n9NQIge83u-zMcQ3vbSWjumtiS4JkAQc2jh50VEPIXUM0giQGq-pimE4eacDuLJD0mDDgqpUZnG4jNPtmXRNhpImJr3fuXHiNxk5THrVtbLySptu2TZ_pJRA',
        alt: 'Park rangers gathered around a topographical map inside ranger station'
    }
];

export const MOCK_TRANSACTIONS = [
    {
        transactionId: `TXN-${DEMO_YEAR}-1024`,
        dateBooked: monthDateLabel(0, 20),
        hikeDate: AMTIC_HIKE_DAY.date,
        trail: AMTIC_HIKE_DAY.trail,
        participantCount: 2,
        status: 'Confirmed',
        totalPaid: '₱1,850.00',
        paymentMethod: 'GCash',
        referenceNo: 'Ref: GCASH9928172',
        passesData: [
            {
                id: `MMPL-${DEMO_YEAR}-1024-1`,
                qrCodeUrl: QR,
                status: 'Valid',
                date: AMTIC_HIKE_DAY.date,
                trail: AMTIC_HIKE_DAY.trail,
                guideHiker: 'Rodel Villanueva',
                hikerName: 'Jane Doe',
            },
            {
                id: `MMPL-${DEMO_YEAR}-1024-2`,
                qrCodeUrl: QR,
                status: 'Valid',
                date: AMTIC_HIKE_DAY.date,
                trail: AMTIC_HIKE_DAY.trail,
                guideHiker: 'Rodel Villanueva',
                hikerName: 'John Smith',
            },
        ],
        receiptData: {
            breakdown: [
                { label: 'Environmental Fee (2 x ₱150)', amount: '₱300.00' },
                { label: 'Guide Fee (1 Guide)', amount: '₱1,500.00' },
                { label: 'Processing Fee', amount: '₱50.00' },
            ],
            totalPaid: '₱1,850.00',
            paymentMethod: 'Paid via GCash',
            referenceNo: 'Ref: GCASH9928172',
        },
    },
    {
        transactionId: `TXN-${DEMO_YEAR}-0812`,
        dateBooked: monthDateLabel(-1, 5),
        hikeDate: LIGAO_PAST_HIKE_DAY.date,
        trail: LIGAO_PAST_HIKE_DAY.trail,
        participantCount: 1,
        status: 'Completed',
        totalPaid: '₱650.00',
        paymentMethod: 'Maya',
        referenceNo: 'Ref: MYA88301923',
        passesData: [
            {
                id: `MMPL-${DEMO_YEAR}-0812-1`,
                qrCodeUrl: QR,
                status: 'Used',
                date: LIGAO_PAST_HIKE_DAY.date,
                trail: LIGAO_PAST_HIKE_DAY.trail,
                guideHiker: 'Jose Reyes',
                hikerName: 'Jane Doe',
            },
        ],
        receiptData: {
            breakdown: [
                { label: 'Environmental Fee (1 x ₱150)', amount: '₱150.00' },
                { label: 'Guide Fee (Shared Group)', amount: '₱450.00' },
                { label: 'Processing Fee', amount: '₱50.00' },
            ],
            totalPaid: '₱650.00',
            paymentMethod: 'Paid via Maya',
            referenceNo: 'Ref: MYA88301923',
        },
    },
];

export const REQUIREMENTS = [
    {
        id: 1,
        title: 'Mandatory Local Guide (1 per 5 hikers)',
        icon: CircleCheck,
        isWarning: false,
    },
    {
        id: 2,
        title: 'Environmental Fee (₱150/head)',
        icon: CircleCheck,
        isWarning: false,
    },
    {
        id: 3,
        title: 'Valid ID presented at Jump-off',
        icon: CircleCheck,
        isWarning: false,
    },
    {
        id: 4,
        title: 'Strictly no walk-ins during weekends',
        icon: TriangleAlert,
        isWarning: true,
    },
];

export const FAQ_CATEGORIES = [
    {
        icon: Receipt,
        title: 'Booking & Payments',
        items: [
            {
                question: 'How do I secure a permit?',
                answer:
                    'Permits can be reserved online through our official booking engine by selecting an authorized trail schedule, registering hiker details, and paying the required fees. We recommend booking at least 5 to 7 days before your target climb date as daily climber quotas are strictly observed by the PAMB-DENR office.',
            },
            {
                question: 'What payment methods are accepted?',
                answer:
                    'We accept GCash, Maya, major Credit/Debit cards (Visa & Mastercard), and Landbank / BDO direct bank transfer through our government merchant gateway.',
            },
        ],
    },
    {
        icon: ShieldCheck,
        title: 'Physical Requirements',
        items: [
            {
                question: 'Do I need to upload my Health Certificate?',
                answer: 'No digital upload is required during online booking. However, you must bring physical hard copies of your valid Medical Certificate ("Fit to Climb") issued within 7 days of the hike date to present to rangers at the jump-off registration desk.',
            },
            {
                question: 'What are the mandatory documents to bring?',
                answer:
                    'Hikers must present: (1) Official Booking Ticket / Digital Hike Pass, (2) One Valid Government-issued ID, (3) Physician-signed Health Declaration / Medical Clearance, and (4) Valid Barangay Clearance or Cedula (Community Tax Certificate).',
            },
        ],
    },
    {
        icon: Cloud,
        title: 'Weather & Safety Policies',
        items: [
            {
                question: 'What happens if there is a Typhoon alert?',
                answer:
                    'Under PAGASA Tropical Cyclone Wind Signal (TCWS) #1 or higher, all mountain trails are automatically closed for safety by the DENR-PAMB office. Affected bookings are eligible for free rescheduling within 6 months or a full refund.',
            },
            {
                question: 'Are guides mandatory?',
                answer:
                    'Yes, accredited local DENR ecotourism guides are mandatory at a ratio of 1 guide per 5 hikers to ensure trail safety and environmental preservation.',
            },
        ],
    },
    {
        icon: RotateCcw,
        title: 'Cancellations & Refunds',
        items: [
            {
                question: 'Can I reschedule my hike?',
                answer:
                    'Hike schedules can be rescheduled up to 48 hours prior to your hike date through your Hiker Dashboard or by contacting support, subject to slot availability.',
            },
            {
                question: 'What is the refund policy for weather-related closures?',
                answer:
                    'If trails are closed by PAMB/DENR due to severe weather, force majeure, or volcanic advisories, 100% of registration fees are refunded or credited towards a rescheduled date.',
            },
        ],
    },
];

export const POPULAR_TOPICS = [
    { icon: FileText, label: 'Permit Requirements' },
    { icon: CreditCard, label: 'Payment Methods' },
    { icon: Mountain, label: 'Trail Difficulty' },
    { icon: CloudLightning, label: 'Weather & Alerts' },
];

export const ABOUT_ZONES = [
    {
        id: 'summit',
        title: 'Mount Masaraga Summit',
        desc: 'An inactive 1,328-meter stratovolcano featuring steep, rugged ridges and mossy forests. Regulated trekking trails lead to the summit crest, offering a stunning 360-degree view of Mt. Mayon and Mt. Malinao.',
        image: mtMasaragaSummit,
    },
    {
        id: 'campsite',
        title: 'The Campsite',
        desc: 'An established, open-air grassy campground situated right on the mountains accessible slopes. It serves as the primary jump-off point for visitors wanting to safely observe the pristine mountain environment.',
        image: mtMasaragaCampsite,
    },
    {
        id: 'watershed',
        title: 'Natural Springs Trail',
        desc: 'An eco-trail navigating the mountains lower primary forest slopes, which house 27 natural springs and 4 major rivers supplying clean, crystalline volcanic water to the Bicol River Basin.',
        image: mtMasaragaNaturalSpring,
    },
    {
        id: 'falls',
        title: 'The Vanishing Falls',
        desc: 'A hidden, ephemeral waterfall deep within the rainforest that flows exclusively after heavy rains. Reaching this seasonal wonder requires a guided 1-hour eco-trek through protected mountain trails.',
        image: mtMasaragaVanishingFalls,
    }
];

export const ABOUT_RESOURCES = [
    {
        icon: Map,
        title: 'Offline Trail Maps',
        description: 'High-resolution GPX and PDF maps for offline navigation.',
        href: '#download-maps',
    },
    {
        icon: Phone,
        title: 'Emergency Guide',
        description: 'Local rescue contacts, protocols, and nearest medical facilities.',
        href: '#download-emergency',
    },
    {
        icon: Leaf,
        title: 'Flora & Fauna Checklist',
        description: 'Identify endemic species and follow Leave No Trace principles.',
        href: '#download-checklist',
    },
];

export const BOOKING_DETAILS = {
    amtic: {
        id: 'amtic',
        selectedTrail: 'Sabluyon Trail',
        baseFeePerPax: 500.0,
        note: '*Total calculated on next step based on pax count.',
    },
    ligao: {
        id: 'ligao',
        selectedTrail: 'Balogo Trail',
        baseFeePerPax: 500.0,
        note: '*Total calculated on next step based on pax count.',
    },
};

export const DEFAULT_CONVERSATIONS = [
    {
        id: 'park-announcements',
        type: 'admin',
        title: 'Park announcements',
        subtitle: 'Updates for staff and assigned groups',
        lastMessage: 'Trail conditions and park notices from the management office.',
        timestamp: '9:30 AM',
        unreadCount: 0,
        icon: ShieldAlert,
    },
];

export const CHECKLIST_ITEMS = [
    {
        id: 'id_card',
        title: 'Valid Government-Issued ID card',
        description: 'Original copy for verification purposes.',
    },
    {
        id: 'health_declaration',
        title: 'Health Declaration',
        description: 'System Generated',
    },
    {
        id: 'barangay_clearance',
        title: 'Barangay Clearance / Community Tax Certificate',
        description: 'Recent copy applicable for the current year.',
    },
    {
        id: 'booking_ticket',
        title: 'Booking Ticket Copy',
        description: 'System Generated Ticket',
    },
];

export const HEALTH_QUESTIONS = [
    {
        id: 'health1',
        question:
            'Do you have a history of asthma, hypertension, heart disease, or irregular heartbeats?',
    },
    {
        id: 'health2',
        question:
            'Can you comfortably walk or jog for 1 hour without experiencing severe shortness of breath or dizziness?',
    },
    {
        id: 'health3',
        question:
            'Do you have any chronic joint, knee, or back injuries that limit your balance or ability to climb steep slopes?',
    },
    {
        id: 'health4',
        question:
            'Do you have hemophilia, a bleeding disorder, or take blood thinners that might cause prolonged bleeding from limatik bites?',
    },
    {
        id: 'health5',
        question:
            'Do you carry an EpiPen, inhaler, or specific antihistamines for known severe allergic reactions (Anaphylaxis)?',
    },
    {
        id: 'health6',
        question:
            'Have you undergone any major surgical procedures or suffered a debilitating illness within the past six (6) months?',
    },
];

export const PAYMENT_METHODS = [
    {
        id: 'gcash',
        label: 'GCash',
        icon: Wallet,
    },
    {
        id: 'maya',
        label: 'Maya',
        icon: QrCode,
    },
    {
        id: 'landbank',
        label: 'Landbank',
        icon: Building2,
    },
    {
        id: 'visa',
        label: 'Visa',
        icon: CreditCard,
    },
    {
        id: 'mastercard',
        label: 'Mastercard',
        icon: CreditCard,
    },
];

export const DEFAULT_BOOKING_SUMMARY = {
    trail: 'Sabluyon Trail',
    date: 'Oct 24, 2024',
    participants: '4 Pax',
    breakdown: [
        { label: 'Environmental Fee (4 x ₱150)', amount: 600.0 },
        { label: 'Guide Fee (1 Guide)', amount: 1200.0 },
        { label: 'Processing Fee', amount: 50.0 },
    ],
    totalAmount: 1850.0,
};

// Admin mock database: powers the Admin Console. Amounts and slot counts below
// are this app's seeded data (mirrored by adminStore.js), matching the names,
// trails, and dates already used across the public booking datasets.
export const ADMIN_USERS = [
    {
        id: 'user_admin',
        name: 'Juan Dela Cruz',
        email: 'admin@masaraga.gov.ph',
        role: 1,
        subtitle: 'System Administrator',
        status: 'Active',
        permissions: null,
    },
    {
        id: 'user_staff',
        name: 'Maria Santos',
        email: 'staff@masaraga.gov.ph',
        role: 2,
        subtitle: 'Park Staff / Guide',
        status: 'Active',
        permissions: ['bookings', 'trails', 'guides'],
    },
    {
        id: 'user_hiker',
        name: 'Jon Eric Tripulca',
        email: 'hiker@example.com',
        role: 3,
        subtitle: 'Hiker',
        status: 'Active',
        permissions: null,
    },
    {
        id: 'user_jane',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        role: 3,
        subtitle: 'Hiker',
        status: 'Active',
        permissions: null,
    },
    {
        id: 'user_marcus',
        name: 'Marcus Chen',
        email: 'marcus.chen@example.com',
        role: 3,
        subtitle: 'Hiker',
        status: 'Active',
        permissions: null,
    },
    {
        id: 'user_elena',
        name: 'Elena Santos',
        email: 'elena.santos@example.com',
        role: 3,
        subtitle: 'Hiker',
        status: 'Active',
        permissions: null,
    },
];

export const ADMIN_BOOKINGS = [
    {
        id: `BK-${DEMO_YEAR}-1024-01`,
        scheduleId: AMTIC_HIKE_DAY.id,
        reference: `TXN-${DEMO_YEAR}-0928`,
        guideHiker: 'Rodel Villanueva',
        contact: 'r.villanueva@masaraga.gov.ph',
        trail: AMTIC_HIKE_DAY.trail,
        date: AMTIC_HIKE_DAY.date,
        participants: 2,
        totalPaid: 1850,
        paymentMethod: 'GCash',
        status: 'Upcoming',
        feeBreakdown: [
            { label: 'Environmental fee (2 pax)', amount: 500 },
            { label: 'Guide fee', amount: 1300 },
            { label: 'Processing fee', amount: 50 },
        ],
        documents: [
            { id: 'id_card', title: 'Valid Government-Issued ID card', status: 'Complete' },
            { id: 'booking_ticket', title: 'Booking Ticket Copy', status: 'Complete' },
            { id: 'barangay_clearance', title: 'Barangay Clearance / Community Tax Certificate', status: 'Complete' },
            { id: 'health_declaration', title: 'Health Declaration', status: 'Missing' },
        ],
        hikers: [
            {
                fullName: 'Jon Eric D. Tripulca',
                dateOfBirth: '1994-05-12',
                address: 'Ligao City, Albay',
                emergencyName: 'Maria Doe',
                emergencyRelationship: 'Mother',
                emergencyContact: '+63 900 123 4567',
                healthAnswers: {
                    health1: 'no', health2: 'yes', health3: 'no', health4: 'no', health5: 'no', health6: 'no',
                },
                agreeWaiver: true,
            },
            // {
            //     fullName: 'John Smith',
            //     dateOfBirth: '1991-08-23',
            //     address: 'Ragay, Albay',
            //     emergencyName: 'Michael Smith',
            //     emergencyRelationship: 'Brother',
            //     emergencyContact: '+63 900 765 4321',
            //     healthAnswers: {
            //         health1: 'no', health2: 'yes', health3: 'no', health4: 'no', health5: 'no', health6: 'no',
            //     },
            //     agreeWaiver: true,
            // },
        ],
    },
    {
        id: `BK-${DEMO_YEAR}-1024-02`,
        scheduleId: AMTIC_HIKE_DAY.id,
        reference: `TXN-${DEMO_YEAR}-0930`,
        guideHiker: 'Jose Reyes',
        contact: 'j.reyes@masaraga.gov.ph',
        trail: AMTIC_HIKE_DAY.trail,
        date: AMTIC_HIKE_DAY.date,
        participants: 5,
        totalPaid: 2000,
        paymentMethod: 'Maya',
        status: 'Upcoming',
        feeBreakdown: [
            { label: 'Environmental fee (5 pax)', amount: 1250 },
            { label: 'Guide fee', amount: 700 },
            { label: 'Processing fee', amount: 50 },
        ],
        documents: [
            { id: 'id_card', title: 'Valid Government-Issued ID card', status: 'Complete' },
            { id: 'booking_ticket', title: 'Booking Ticket Copy', status: 'Complete' },
            { id: 'health_declaration', title: 'Health Declaration', status: 'Complete' },
            { id: 'barangay_clearance', title: 'Barangay Clearance / Community Tax Certificate', status: 'Missing' },
        ],
        hikers: [
            {
                fullName: 'Marcus Chen',
                dateOfBirth: '1989-02-14',
                address: 'Ligao City, Albay',
                emergencyName: 'Linda Chen',
                emergencyRelationship: 'Mother',
                emergencyContact: '+63 900 234 5678',
                healthAnswers: {
                    health1: 'no', health2: 'yes', health3: 'no', health4: 'no', health5: 'no', health6: 'no',
                },
                agreeWaiver: true,
            },
            {
                fullName: 'Ana Reyes',
                dateOfBirth: '1996-11-03',
                address: 'Bacoor, Cavite',
                emergencyName: 'Jose Reyes',
                emergencyRelationship: 'Father',
                emergencyContact: '+63 900 345 6789',
                healthAnswers: {
                    health1: 'no', health2: 'yes', health3: 'no', health4: 'no', health5: 'no', health6: 'no',
                },
                agreeWaiver: true,
            },
            {
                fullName: 'Luis Santos',
                dateOfBirth: '1993-07-19',
                address: 'Daet, Camarines Norte',
                emergencyName: 'Rosa Santos',
                emergencyRelationship: 'Sister',
                emergencyContact: '+63 900 456 7890',
                healthAnswers: {
                    health1: 'no', health2: 'yes', health3: 'no', health4: 'no', health5: 'no', health6: 'no',
                },
                agreeWaiver: true,
            },
            {
                fullName: 'Carla Gomez',
                dateOfBirth: '2000-01-27',
                address: 'Manila',
                emergencyName: 'Pedro Gomez',
                emergencyRelationship: 'Father',
                emergencyContact: '+63 900 567 8901',
                healthAnswers: {
                    health1: 'no', health2: 'yes', health3: 'no', health4: 'no', health5: 'no', health6: 'no',
                },
                agreeWaiver: true,
            },
            {
                fullName: 'Paolo Cruz',
                dateOfBirth: '1998-09-08',
                address: 'Naga City',
                emergencyName: 'Teresa Cruz',
                emergencyRelationship: 'Mother',
                emergencyContact: '+63 900 678 9012',
                healthAnswers: {
                    health1: 'no', health2: 'yes', health3: 'no', health4: 'no', health5: 'no', health6: 'no',
                },
                agreeWaiver: true,
            },
        ],
    },
    {
        id: `BK-${DEMO_YEAR}-1024-03`,
        scheduleId: LIGAO_HIKE_DAY.id,
        reference: `TXN-${DEMO_YEAR}-1002`,
        guideHiker: 'Maria Santos',
        contact: 'm.santos@masaraga.gov.ph',
        trail: LIGAO_HIKE_DAY.trail,
        date: LIGAO_HIKE_DAY.date,
        participants: 3,
        totalPaid: 1700,
        paymentMethod: 'LandBank',
        status: 'Upcoming',
        feeBreakdown: [
            { label: 'Environmental fee (3 pax)', amount: 750 },
            { label: 'Guide fee', amount: 900 },
            { label: 'Processing fee', amount: 50 },
        ],
        documents: [
            { id: 'id_card', title: 'Valid Government-Issued ID card', status: 'Complete' },
            { id: 'booking_ticket', title: 'Booking Ticket Copy', status: 'Complete' },
            { id: 'barangay_clearance', title: 'Barangay Clearance / Community Tax Certificate', status: 'Complete' },
            { id: 'health_declaration', title: 'Health Declaration', status: 'Complete' },
        ],
        hikers: [
            {
                fullName: 'Elena Santos',
                dateOfBirth: '1995-04-16',
                address: 'Ligao City, Albay',
                emergencyName: 'Jose Santos',
                emergencyRelationship: 'Father',
                emergencyContact: '+63 900 789 0123',
                healthAnswers: {
                    health1: 'no', health2: 'yes', health3: 'no', health4: 'no', health5: 'no', health6: 'no',
                },
                agreeWaiver: true,
            },
            {
                fullName: 'Diego Ramos',
                dateOfBirth: '1992-12-05',
                address: 'Irosin, Sorsogon',
                emergencyName: 'Carmen Ramos',
                emergencyRelationship: 'Mother',
                emergencyContact: '+63 900 890 1234',
                healthAnswers: {
                    health1: 'no', health2: 'yes', health3: 'no', health4: 'no', health5: 'no', health6: 'no',
                },
                agreeWaiver: true,
            },
            {
                fullName: 'Nina Villanueva',
                dateOfBirth: '1999-06-30',
                address: 'Polangui, Albay',
                emergencyName: 'Carlos Villanueva',
                emergencyRelationship: 'Brother',
                emergencyContact: '+63 900 901 2345',
                healthAnswers: {
                    health1: 'no', health2: 'yes', health3: 'no', health4: 'no', health5: 'no', health6: 'no',
                },
                agreeWaiver: true,
            },
        ],
    },
    {
        id: `BK-${DEMO_YEAR}-1024-04`,
        scheduleId: AMTIC_HIKE_DAY.id,
        reference: `TXN-${DEMO_YEAR}-1024`,
        guideHiker: 'Paolo Cruz',
        contact: 'p.cruz@masaraga.gov.ph',
        trail: AMTIC_HIKE_DAY.trail,
        date: AMTIC_HIKE_DAY.date,
        participants: 2,
        totalPaid: 1850,
        paymentMethod: 'VISA',
        status: 'Confirmed',
        guide: 'R. Villanueva',
        feeBreakdown: [
            { label: 'Environmental fee (2 pax)', amount: 500 },
            { label: 'Guide fee', amount: 1300 },
            { label: 'Processing fee', amount: 50 },
        ],
        documents: [
            { id: 'id_card', title: 'Valid Government-Issued ID card', status: 'Complete' },
            { id: 'booking_ticket', title: 'Booking Ticket Copy', status: 'Complete' },
            { id: 'barangay_clearance', title: 'Barangay Clearance / Community Tax Certificate', status: 'Complete' },
            { id: 'health_declaration', title: 'Health Declaration', status: 'Complete' },
        ],
        hikers: [
            {
                fullName: 'Jane Doe',
                dateOfBirth: '1994-05-12',
                address: 'Ligao City, Albay',
                emergencyName: 'Maria Doe',
                emergencyRelationship: 'Mother',
                emergencyContact: '+63 900 123 4567',
                healthAnswers: {
                    health1: 'no', health2: 'yes', health3: 'no', health4: 'no', health5: 'no', health6: 'no',
                },
                agreeWaiver: true,
            },
            {
                fullName: 'John Smith',
                dateOfBirth: '1991-08-23',
                address: 'Ragay, Albay',
                emergencyName: 'Michael Smith',
                emergencyRelationship: 'Brother',
                emergencyContact: '+63 900 765 4321',
                healthAnswers: {
                    health1: 'no', health2: 'yes', health3: 'no', health4: 'no', health5: 'no', health6: 'no',
                },
                agreeWaiver: true,
            },
        ],
    },
    {
        id: `BK-${DEMO_YEAR}-0812-01`,
        scheduleId: LIGAO_PAST_HIKE_DAY.id,
        reference: `TXN-${DEMO_YEAR}-0812`,
        guideHiker: 'Ana Delos Santos',
        contact: 'a.delsantos@masaraga.gov.ph',
        trail: LIGAO_PAST_HIKE_DAY.trail,
        date: LIGAO_PAST_HIKE_DAY.date,
        participants: 1,
        totalPaid: 650,
        paymentMethod: 'Mastercard',
        status: 'Completed',
        guide: 'M. Santos',
        feeBreakdown: [
            { label: 'Environmental fee (1 pax)', amount: 250 },
            { label: 'Guide fee', amount: 350 },
            { label: 'Processing fee', amount: 50 },
        ],
        documents: [
            { id: 'id_card', title: 'Valid Government-Issued ID card', status: 'Complete' },
            { id: 'booking_ticket', title: 'Booking Ticket Copy', status: 'Complete' },
            { id: 'barangay_clearance', title: 'Barangay Clearance / Community Tax Certificate', status: 'Complete' },
            { id: 'health_declaration', title: 'Health Declaration', status: 'Complete' },
        ],
        hikers: [
            {
                fullName: 'Elena Santos',
                dateOfBirth: '1995-04-16',
                address: 'Ligao City, Albay',
                emergencyName: 'Jose Santos',
                emergencyRelationship: 'Father',
                emergencyContact: '+63 900 789 0123',
                healthAnswers: {
                    health1: 'no', health2: 'yes', health3: 'no', health4: 'no', health5: 'no', health6: 'no',
                },
                agreeWaiver: true,
            },
        ],
    },
];

// Slot quota for the park's headline climb day (see ADMIN_SCHEDULES above).
export const ADMIN_DAILY_QUOTA = [
    {
        trailId: AMTIC_HIKE_DAY.trailId,
        trail: AMTIC_HIKE_DAY.trail,
        date: AMTIC_HIKE_DAY.date,
        dateKey: AMTIC_HIKE_DAY.dateKey,
        booked: AMTIC_HIKE_DAY.booked,
        capacity: AMTIC_HIKE_DAY.capacity,
        status: AMTIC_HIKE_DAY.status,
    },
    {
        trailId: LIGAO_HIKE_DAY.trailId,
        trail: LIGAO_HIKE_DAY.trail,
        date: LIGAO_HIKE_DAY.date,
        dateKey: LIGAO_HIKE_DAY.dateKey,
        booked: LIGAO_HIKE_DAY.booked,
        capacity: LIGAO_HIKE_DAY.capacity,
        status: LIGAO_HIKE_DAY.status,
    },
];

export const ADMIN_GUIDES = [
    {
        id: 'guide-001',
        name: 'Rodel Villanueva',
        email: 'r.villanueva@masaraga.gov.ph',
        phone: '+63 917 123 4567',
        specialization: 'Summit Assault',
        certification: 'DENR Accredited',
        status: 'Active',
        assignedTrails: ['amtic'],
        dateAccredited: '2023-06-15',
        totalClimbs: 187,
        rating: 4.9,
        emergencyContact: '+63 917 111 2222',
        notes: 'Lead guide for Amtic Trail. Expert in rope-assisted ridge sections.',
    },
    {
        id: 'guide-002',
        name: 'Maria Santos',
        email: 'm.santos@masaraga.gov.ph',
        phone: '+63 918 234 5678',
        specialization: 'Eco-Trail & Flora/Fauna',
        certification: 'DENR Accredited',
        status: 'Active',
        assignedTrails: ['ligao'],
        dateAccredited: '2023-08-20',
        totalClimbs: 142,
        rating: 4.8,
        emergencyContact: '+63 918 222 3333',
        notes: 'Specializes in Balogo Trail. Certified wildlife spotter and Leave No Trace trainer.',
    },
    {
        id: 'guide-003',
        name: 'Jose Reyes',
        email: 'j.reyes@masaraga.gov.ph',
        phone: '+63 919 345 6789',
        specialization: 'First Aid & Safety',
        certification: 'DENR Accredited',
        status: 'Active',
        assignedTrails: ['amtic', 'ligao'],
        dateAccredited: '2024-01-10',
        totalClimbs: 98,
        rating: 4.7,
        emergencyContact: '+63 919 333 4444',
        notes: 'Wilderness first aid certified. Covers both Amtic and Balogo trails.',
    },
    {
        id: 'guide-004',
        name: 'Ana Delos Santos',
        email: 'a.delsantos@masaraga.gov.ph',
        phone: '+63 920 456 7890',
        specialization: 'Beginner Groups',
        certification: 'DENR Accredited',
        status: 'Active',
        assignedTrails: ['ligao'],
        dateAccredited: '2024-03-05',
        totalClimbs: 64,
        rating: 4.6,
        emergencyContact: '+63 920 444 5555',
        notes: 'Patient guide experienced with first-time hikers. Fluent in Bicolano and Tagalog.',
    },
    {
        id: 'guide-005',
        name: 'Paolo Cruz',
        email: 'p.cruz@masaraga.gov.ph',
        phone: '+63 921 567 8901',
        specialization: 'Summit Assault',
        certification: 'Provisional',
        status: 'On Leave',
        assignedTrails: ['amtic'],
        dateAccredited: '2024-06-18',
        totalClimbs: 31,
        rating: 4.5,
        emergencyContact: '+63 921 555 6666',
        notes: 'Provisional accreditation pending completion of 50 solo climb requirement.',
    },
    {
        id: 'guide-006',
        name: 'Ramon Valdez',
        email: 'r.valdez@masaraga.gov.ph',
        phone: '+63 922 678 9012',
        specialization: 'Emergency Response',
        certification: 'DENR Accredited',
        status: 'Active',
        assignedTrails: ['amtic', 'ligao'],
        dateAccredited: '2023-11-01',
        totalClimbs: 156,
        rating: 4.9,
        emergencyContact: '+63 922 666 7777',
        notes: 'Trained emergency responder. Handles trail evacuations and weather-related incidents.',
    },
];

export const LEGAL_PAGES = {
    'privacy-policy': {
        label: 'Privacy Policy',
        title: 'Privacy Policy',
        subtitle: '',
        lastUpdated: '2026-09-18',
        enabled: true,
        showInFooter: true,
        introductoryContent: [],
        sections: [
            {
                title: '1. Introduction',
                content: [
                    { type: 'paragraph', text: 'The Mt. Masaraga Protected Landscape, under the stewardship of the Protected Area Management Board (PAMB) and the Department of Environment and Natural Resources (DENR), operates this booking and information platform to manage ecotourism within the protected area.' },
                    { type: 'paragraph', text: 'This Privacy Policy explains what personal information we collect, how we use and protect it, and the choices you have over your data. We are committed to protecting your personal information in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173) and related rules issued by the National Privacy Commission (NPC).' },
                    { type: 'paragraph', text: 'By using this platform to apply for permits, book trail dates, or communicate with park staff, you agree to the practices described in this policy.' },
                ],
            },
            {
                title: '2. Information We Collect',
                content: [
                    { type: 'paragraph', text: 'We collect the following categories of personal information:' },
                    {
                        type: 'list',
                        items: [
                            'Identity and contact details: full name, date of birth, valid government ID number, email address, and mobile number.',
                            'Permit and booking details: intended trail, number of members in your group, preferred date, and the booking reference generated by the system.',
                            'Emergency and safety information: emergency contact name and number, and health-related declarations you voluntarily provide for your own safety on the trail.',
                            'Payment information: payment method and reference numbers. We do not store full card numbers or payment credentials on our servers.',
                            'Technical information: your IP address, device type, browser type, and pages visited, collected through server logs and cookies, as described in our Cookie Policy.',
                        ],
                    },
                ],
            },
            {
                title: '3. How We Use Your Information',
                content: [
                    { type: 'paragraph', text: 'Your information is used only for purposes directly related to protected area management:' },
                    {
                        type: 'list',
                        items: [
                            'To process permit applications and trail bookings, including payment confirmation.',
                            'To verify your identity at trailheads and for mandatory visitor registration under DENR guidelines.',
                            'To contact you regarding your booking, changes in trail conditions, or safety announcements.',
                            'To reach your emergency contact if you fail to check out or if an emergency is reported.',
                            'To compile visitor statistics needed for conservation planning and reporting, always in aggregate and de-identified form.',
                            'To respond to your inquiries through the help desk and contact pages.',
                        ],
                    },
                    { type: 'paragraph', text: 'We do not sell, rent, or trade your personal information to third parties.' },
                ],
            },
            {
                title: '4. Legal Basis for Processing',
                content: [
                    { type: 'paragraph', text: 'We process personal information on the following grounds: your consent, which you may withdraw at any time by contacting us; the fulfillment of legal obligations imposed on us as managers of a protected area, including visitor registration and record keeping; and the protection of your vital interests in the case of emergencies on the mountain.' },
                ],
            },
            {
                title: '5. Sharing and Disclosure',
                content: [
                    { type: 'paragraph', text: 'Your information may be shared in the following limited circumstances:' },
                    {
                        type: 'list',
                        items: [
                            'With authorized DENR and PAMB offices for permit validation, enforcement, and reporting.',
                            'With your emergency contact, search and rescue teams, or medical personnel in the event of an emergency.',
                            'With payment service providers (GCash, Maya, and Landbank) solely for processing the payment you initiated.',
                            'When required by law, subpoena, or government regulation.',
                        ],
                    },
                    { type: 'paragraph', text: 'Any external party that receives your data is bound by confidentiality obligations and processes data only for the purpose for which it was shared.' },
                ],
            },
            {
                title: '6. Data Retention',
                content: [
                    { type: 'paragraph', text: 'Booking and permit records are retained for as long as your account is active and for audit purposes after closure, in line with DENR record keeping requirements. Emergency and safety declarations are kept only for the duration of your trail activity and a reasonable period afterward for incident reporting. Technical logs are retained no longer than necessary for security and performance purposes.' },
                ],
            },
            {
                title: '7. Data Security',
                content: [
                    { type: 'paragraph', text: 'We apply appropriate organizational and technical safeguards, including encrypted transport of data, restricted access for trained staff only, and routine deletion of data that is no longer needed. While no system is completely secure, we work to protect your information against accidental or unlawful destruction, loss, alteration, and unauthorized disclosure.' },
                ],
            },
            {
                title: '8. Your Rights',
                content: [
                    { type: 'paragraph', text: 'Under the Data Privacy Act, you have the right to:' },
                    {
                        type: 'list',
                        items: [
                            'Be informed whether your personal information is being processed and how.',
                            'Request access to the personal information we hold about you.',
                            'Request correction of inaccurate or incomplete information.',
                            'Request deletion or blocking of your data, subject to legal retention requirements.',
                            'Object to processing and, where applicable, request data portability.',
                            'File a complaint with the National Privacy Commission if you believe your rights have been violated.',
                        ],
                    },
                ],
            },
            {
                title: '9. Contact Us',
                content: [
                    { type: 'paragraph', text: 'For any privacy concern, request, or complaint, contact:' },
                    {
                        type: 'list',
                        items: [
                            'Data Protection Officer, Mt. Masaraga Protected Landscape, DENR/PAMB Local Office, Ligao City, Albay.',
                            'Email: support@masaraga.gov.ph',
                            'You may also reach the National Privacy Commission at https://privacy.gov.ph for complaints.',
                        ],
                    },
                ],
            },
            {
                title: '10. Changes to This Policy',
                content: [
                    { type: 'paragraph', text: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with a revised "Last updated" date. Continued use of the platform after changes take effect constitutes acceptance of the updated policy.' },
                ],
            },
        ],
    },
    'cookie-policy': {
        label: 'Cookie Policy',
        title: 'Cookie Policy',
        subtitle: '',
        lastUpdated: '2026-09-18',
        enabled: true,
        showInFooter: true,
        introductoryContent: [],
        sections: [
            {
                title: '1. What Cookies Are',
                content: [
                    { type: 'paragraph', text: 'Cookies are small text files stored on your device when you visit a website. They help the platform remember your preferences, keep you signed in securely, and understand how visitors use the site so it can be improved.' },
                ],
            },
            {
                title: '2. Cookies We Use',
                content: [
                    { type: 'paragraph', text: 'We use the following categories of cookies:' },
                    {
                        type: 'list',
                        items: [
                            'Essential cookies: required for the platform to function, including session authentication and security protection when you log in or complete a booking. These cannot be disabled.',
                            'Preference cookies: remember your choices such as language and previously viewed trail pages, so you do not have to reselect them.',
                            'Analytics cookies: collect anonymous usage data such as which pages are visited and how long visitors stay, so we can improve the booking experience. This information is aggregated and does not identify you personally.',
                            'Payment session cookies: set temporarily while you complete a payment, to confirm the transaction is processed correctly.',
                        ],
                    },
                ],
            },
            {
                title: '3. Third-Party Cookies',
                content: [
                    { type: 'paragraph', text: 'We do not set advertising or profiling cookies on this platform. When you pay through our payment partners (GCash, Maya, or Landbank), those providers may set their own cookies or similar technologies within their own pages. Their practices are governed by their respective privacy and cookie policies.' },
                ],
            },
            {
                title: '4. Managing Cookies',
                content: [
                    { type: 'paragraph', text: 'You can control or delete cookies through your browser settings. Most browsers allow you to block cookies entirely, delete existing cookies, or receive a warning before a cookie is stored.' },
                    { type: 'paragraph', text: 'Please note that disabling essential cookies may prevent you from logging in, booking a trail, or completing a payment, since these core functions depend on them.' },
                ],
            },
            {
                title: '5. Changes to This Policy',
                content: [
                    { type: 'paragraph', text: 'We may update this Cookie Policy as our technology or legal obligations change. The latest version will always be available on this page with a revised "Last updated" date.' },
                ],
            },
            {
                title: '6. Contact Us',
                content: [
                    { type: 'paragraph', text: 'Questions about cookies or how your information is handled can be sent to support@masaraga.gov.ph or to the DENR/PAMB Local Office, Ligao City, Albay.' },
                ],
            },
        ],
    },
    'ecotourism-policy': {
        label: 'Ecotourism Policy',
        title: 'Ecotourism Policy',
        subtitle: 'Leave No Trace',
        lastUpdated: '2026-09-18',
        enabled: true,
        showInFooter: true,
        introductoryContent: [
            { type: 'paragraph', text: 'Mt. Masaraga Protected Landscape is a living ecosystem, not a playground. As a condition of entry, every hiker agrees to follow the Leave No Trace principles below. Violations are enforced by park staff and may lead to permit revocation and administrative fines.' },
        ],
        sections: [
            {
                title: '1. Plan Ahead and Prepare',
                content: [
                    {
                        type: 'list',
                        items: [
                            'Secure a mandatory permit through this booking platform before ascending.',
                            'Check trail conditions and weather updates. Trails close during typhoons, storms, and declared danger periods.',
                            'Keep group sizes within the daily limits published for your chosen trail.',
                            'Carry the required gear listed in the Mandatory Physical Documents Guide, including water, food, and rain protection.',
                        ],
                    },
                ],
            },
            {
                title: '2. Travel on Durable Surfaces',
                content: [
                    {
                        type: 'list',
                        items: [
                            'Stay on marked trails at all times. Do not cut switchbacks or create new paths.',
                            'Walk single file on narrow segments to avoid widening the trail.',
                            'Rest only in designated resting areas. Avoid camping or resting on vegetated slopes and stream banks.',
                        ],
                    },
                ],
            },
            {
                title: '3. Dispose of Waste Properly',
                content: [
                    {
                        type: 'list',
                        items: [
                            'Pack it in, pack it out. All trash you carry up must come back down with you, including food wrappers and cigarette butts.',
                            'Human waste must be buried at least 15 cm deep and 30 meters away from water sources, trails, and camps.',
                            'Do not leave waste in pits, rivers, or bamboo groves. Designated waste collection points are marked on official trail maps.',
                        ],
                    },
                ],
            },
            {
                title: '4. Leave What You Find',
                content: [
                    {
                        type: 'list',
                        items: [
                            'Do not pick plants, dig up roots, or collect seeds, fruits, moss, or bamboo.',
                            'Do not remove rocks, soil, or other natural materials from the mountain.',
                            'Leave artifacts, markings, and cultural objects in place. Report any discovery to park staff.',
                            'Photographs are the only souvenirs you may take from Mt. Masaraga.',
                        ],
                    },
                ],
            },
            {
                title: '5. Minimize Fire Impact',
                content: [
                    {
                        type: 'list',
                        items: [
                            'Open fires are strictly prohibited in all areas of the protected landscape.',
                            'Cooking is allowed only in designated cooking areas using portable stoves that you bring.',
                            'Report any signs of forest fire or illegal clearing to park staff or the emergency hotline immediately.',
                        ],
                    },
                ],
            },
            {
                title: '6. Respect Wildlife',
                content: [
                    {
                        type: 'list',
                        items: [
                            'Observe animals from a distance. Do not chase, feed, or handle wildlife.',
                            'Keep noise levels low to avoid stressing resident fauna, especially bird species active at dawn and dusk.',
                            'Never transport wild animals, eggs, or plants out of the protected area.',
                        ],
                    },
                ],
            },
            {
                title: '7. Be Considerate of Other Visitors',
                content: [
                    {
                        type: 'list',
                        items: [
                            'Yield to descending hikers and to those carrying heavier loads.',
                            'Keep conversation and audio at a level that does not disturb others.',
                            'Follow the instructions of guides and park staff at all times.',
                        ],
                    },
                ],
            },
            {
                title: '8. Enforcement',
                content: [
                    { type: 'paragraph', text: 'Park staff and guides are authorized to warn, expel, or report any visitor who violates these rules. Repeat or serious violations are referred to the Protected Area Management Board and may result in fines, suspension of booking privileges, or legal action under the National Integrated Protected Areas System Act and applicable DENR regulations.' },
                ],
            },
        ],
    },
    'wildlife-protection': {
        label: 'Wildlife Protection',
        title: 'Wildlife Protection',
        subtitle: "Conserving Mt. Masaraga's Native Fauna and Flora",
        lastUpdated: '2026-09-18',
        enabled: true,
        showInFooter: true,
        introductoryContent: [],
        sections: [
            {
                title: '1. Legal Framework',
                content: [
                    { type: 'paragraph', text: "Mt. Masaraga Protected Landscape is managed under the National Integrated Protected Areas System (NIPAS) Act and aligns with the Wildlife Resources Conservation and Protection Act (Republic Act No. 9147). These laws define the protected area's zones, prohibit the taking of wildlife, and impose penalties on violators." },
                    { type: 'paragraph', text: 'The Protected Area Management Board (PAMB), supported by the Department of Environment and Natural Resources, enforces these rules and oversees biodiversity monitoring across the landscape.' },
                ],
            },
            {
                title: '2. What Is Protected',
                content: [
                    { type: 'paragraph', text: "All living organisms found within the protected landscape are protected by law, including birds, mammals, reptiles, amphibians, insects, and all native plant species such as the region's moss forest flora and endemic orchids. Species listed under DENR administrative orders as threatened or endangered receive the highest level of protection." },
                ],
            },
            {
                title: '3. Prohibited Activities',
                content: [
                    {
                        type: 'list',
                        items: [
                            'Hunting, trapping, or collecting any wild animal, egg, or nest.',
                            'Gathering, uprooting, or trading any native plant, orchid, moss, or forest product.',
                            'Introducing non-native or invasive species into the area.',
                            'Disturbing wildlife through feeding, chasing, or excessive noise near nests or dens.',
                            'Damaging habitats by cutting trees, clearing vegetation, or starting fires.',
                            'Removing rocks, soil, or water from the protected area.',
                        ],
                    },
                ],
            },
            {
                title: '4. Zoning Rules',
                content: [
                    {
                        type: 'list',
                        items: [
                            'Strict Protection Zones: closed to entry except for authorized conservation and research activities.',
                            'Core Zones: accessible to hikers only on designated trails and only with a valid permit and guide.',
                            'Buffer and Transition Zones: subject to regulated land use and visitor activities as defined in the protected area management plan.',
                            'Illegal entry into closed zones is treated as a serious violation and is reported for enforcement.',
                        ],
                    },
                ],
            },
            {
                title: '5. Reporting Violations',
                content: [
                    { type: 'paragraph', text: 'If you witness wildlife poaching, illegal logging, feeding, or the collection of plants and animals, report it to park staff at the trailhead or to the DENR/PAMB Local Office. Photographic evidence without approaching wildlife is the safest way to document an incident.' },
                ],
            },
            {
                title: '6. Penalties',
                content: [
                    { type: 'paragraph', text: 'Violations of wildlife protection rules may be filed under Republic Act No. 9147 and the NIPAS Act. Convictions can carry fines, imprisonment, or both, depending on the species involved and the severity of the offense. Administrative sanctions, including permit revocation and loss of booking privileges, also apply to visitors found in violation.' },
                ],
            },
            {
                title: '7. How Visitors Can Help',
                content: [
                    {
                        type: 'list',
                        items: [
                            'Photograph wildlife from a distance with a zoom lens; never approach.',
                            'Walk quietly and stay on marked trails to avoid damaging habitat.',
                            'Follow the Ecotourism Policy (Leave No Trace), detailed on our policies page.',
                            'Support conservation by following guide instructions and park announcements.',
                        ],
                    },
                ],
            },
        ],
    },
    'terms-conditions': {
        label: 'Terms and Conditions',
        title: 'Terms and Conditions',
        subtitle: 'Booking and Use of the Mt. Masaraga Protected Landscape Platform',
        lastUpdated: '2026-09-18',
        enabled: true,
        showInFooter: true,
        introductoryContent: [],
        sections: [
            {
                title: '1. Acceptance of Terms',
                content: [
                    { type: 'paragraph', text: 'The Mt. Masaraga Protected Landscape, under the stewardship of the Protected Area Management Board (PAMB) and the Department of Environment and Natural Resources (DENR), operates this platform to manage permits, trail bookings, and communication with visitors.' },
                    { type: 'paragraph', text: 'By accessing this platform, creating an account, or completing a booking, you agree to these Terms and Conditions, our Privacy Policy, and all applicable laws and DENR regulations that govern entry into the protected area. If you do not agree with any part of these terms, do not use the platform or proceed with a booking.' },
                ],
            },
            {
                title: '2. Eligibility',
                content: [
                    { type: 'paragraph', text: 'You must be at least 18 years old, or have the consent of a parent or legal guardian, to create an account and complete a booking. A valid government-issued ID is required at booking and at the trailhead for verification and mandatory visitor registration.' },
                    { type: 'paragraph', text: 'You are responsible for providing accurate information, including your name, contact details, emergency contact, and the details of every member in your group. Information that is false or incomplete may result in the cancellation of your permit without refund of fees beyond those required by law.' },
                ],
            },
            {
                title: '3. Bookings and Permits',
                content: [
                    {
                        type: 'list',
                        items: [
                            'A confirmed booking reserves a slot for the trail and date you selected, subject to available capacity.',
                            'Your booking is confirmed only after payment is completed and a booking reference is issued.',
                            'Entry into the protected area requires a valid permit, which is granted upon compliance with the documented requirements, including health certificates, barangay clearances, and valid IDs.',
                            'Slots are limited and managed by the park office. Late arrival or failure to present required documents may forfeit your slot.',
                            'The park management may cancel, postpone, or modify bookings when required for safety, conservation, or operational reasons.',
                        ],
                    },
                ],
            },
            {
                title: '4. Payments',
                content: [
                    { type: 'paragraph', text: 'Payments are collected for the base fee per person and a processing fee, as shown on the booking summary before you confirm. We accept payment through GCash, Maya, and Landbank, and through major card networks where available.' },
                    { type: 'paragraph', text: 'You confirm that you are authorized to use the chosen payment method. Refund eligibility is described in our Refund and Return Policy, which is part of these terms.' },
                ],
            },
            {
                title: '5. Trail Rules and Code of Conduct',
                content: [
                    {
                        type: 'list',
                        items: [
                            'Follow the Ecotourism Policy (Leave No Trace) at all times: carry out what you carry in, stay on marked trails, and leave plants and wildlife undisturbed.',
                            'Obey the instructions of your guide and park staff, especially in evacuation, weather, or emergency situations.',
                            'Do not enter zoned or closed areas. Entry is limited to designated trails with a valid permit.',
                            'Do not bring prohibited items, including firearms, firecrackers, and disposable single-use plastics on the trail.',
                            'Silence or muted mobile devices are required near wildlife and at designated quiet points to avoid disturbing native species.',
                        ],
                    },
                ],
            },
            {
                title: '6. Cancellations and Refunds',
                content: [
                    { type: 'paragraph', text: 'Cancellation terms, timelines, and refund eligibility are set out in the Refund and Return Policy. Unless otherwise stated there, the processing fee paid for your booking is non-refundable once a booking is confirmed.' },
                ],
            },
            {
                title: '7. Your Responsibility for Safety',
                content: [
                    { type: 'paragraph', text: 'Hiking in a protected mountain landscape involves inherent physical risks, including steep terrain, weather changes, and physical exertion. You participate at your own risk and are responsible for your fitness, health, and preparation, as well as the preparation of every member of your group.' },
                    { type: 'paragraph', text: 'You must disclose any health condition that could affect your safety or the safety of others so that guides and staff can respond appropriately.' },
                ],
            },
            {
                title: '8. Prohibited Conduct',
                content: [
                    {
                        type: 'list',
                        items: [
                            'Reselling, transferring, or using booking references for a purpose other than your own entry.',
                            'Using the platform to misrepresent your identity, group size, or purpose of visit.',
                            'Attempting to access, disrupt, or interfere with the platform, its data, or its security controls.',
                            'Committing acts that violate the Wildlife Resources Conservation and Protection Act (Republic Act No. 9147) or the NIPAS Act.',
                            'Harassing, threatening, or discriminating against park staff or other visitors.',
                        ],
                    },
                ],
            },
            {
                title: '9. Limitation of Liability',
                content: [
                    { type: 'paragraph', text: 'The park management works to keep this platform accurate, available, and secure, but provides it on an "as is" and "as available" basis. To the fullest extent permitted by law, the DENR, the PAMB, and the park office are not liable for indirect, incidental, or consequential damages arising from your use of the platform or from events on the mountain.' },
                    { type: 'paragraph', text: 'Nothing in these terms limits liability that cannot be limited under Philippine law, including liability for gross negligence or willful misconduct.' },
                ],
            },
            {
                title: '10. Changes to These Terms',
                content: [
                    { type: 'paragraph', text: 'We may update these Terms and Conditions from time to time. Changes will be posted on this page with a revised "Last updated" date. Continued use of the platform after changes take effect constitutes acceptance of the updated terms.' },
                ],
            },
            {
                title: '11. Governing Law',
                content: [
                    { type: 'paragraph', text: 'These terms are governed by the laws of the Republic of the Philippines. Any dispute relating to your use of this platform or to activities within the protected area shall be subject to the exclusive jurisdiction of the appropriate courts of Albay.' },
                ],
            },
            {
                title: '12. Contact',
                content: [
                    { type: 'paragraph', text: 'Questions about these terms can be sent to support@masaraga.gov.ph or to the DENR/PAMB Local Office, Ligao City, Albay.' },
                ],
            },
        ],
    },
    disclaimer: {
        label: 'Disclaimer',
        title: 'Disclaimer',
        subtitle: 'Important Information for Visitors of Mt. Masaraga Protected Landscape',
        lastUpdated: '2026-09-18',
        enabled: true,
        showInFooter: true,
        introductoryContent: [],
        sections: [
            {
                title: '1. General Disclaimer',
                content: [
                    { type: 'paragraph', text: 'The information on this platform is provided by the Mt. Masaraga Protected Landscape, the Protected Area Management Board (PAMB), and the Department of Environment and Natural Resources (DENR) for general information and booking purposes. We update this information regularly, but we do not guarantee that it is always complete, current, or error-free.' },
                    { type: 'paragraph', text: 'Nothing on this platform constitutes legal, medical, or professional advice, and it is not a substitute for consulting with park staff or qualified professionals.' },
                ],
            },
            {
                title: '2. Mountain and Trail Activity Risks',
                content: [
                    { type: 'paragraph', text: 'Hiking and trekking in a protected mountain landscape carries inherent risks, including steep and uneven terrain, slippery trails, changing weather, altitude effects, and physical exhaustion. Such activities may also bring you close to wildlife and remote areas where access to emergency services is limited.' },
                    { type: 'paragraph', text: 'Your participation is voluntary and at your own risk. Assess your fitness, health, and preparation honestly, and follow the safety instructions of your guide and park staff at all times.' },
                ],
            },
            {
                title: '3. Accuracy of Information',
                content: [
                    { type: 'paragraph', text: 'Trail conditions, fees, schedules, and requirements may change without prior notice due to weather, conservation work, or management decisions. The information shown on this platform may not reflect the latest status on the ground. Confirm critical details with park staff before you plan your visit.' },
                    {
                        type: 'list',
                        items: [
                            'Trail status and closure advisories.',
                            'Applicable fees and permits.',
                            'Required documents for entry.',
                            'Operating hours and guide availability.',
                        ],
                    },
                ],
            },
            {
                title: '4. Third-Party Services',
                content: [
                    { type: 'paragraph', text: 'Payments on this platform are facilitated through third-party providers, including GCash, Maya, and Landbank. We do not control these providers and are not responsible for their availability, processing times, or terms. Transactions with these providers are governed by their own terms and privacy policies.' },
                ],
            },
            {
                title: '5. External Links',
                content: [
                    { type: 'paragraph', text: 'Where this platform links to external websites or resources, such as government pages, those links are provided for your convenience. We do not endorse and are not responsible for the content, accuracy, or practices of external sites.' },
                ],
            },
            {
                title: '6. Limitation of Liability',
                content: [
                    { type: 'paragraph', text: 'To the fullest extent permitted by Philippine law, the DENR, the PAMB, and the park office accept no liability for loss, injury, or damage arising from your use of this platform, from the information it contains, or from your participation in activities within the protected area, except where liability is imposed by law.' },
                ],
            },
            {
                title: '7. Emergency and Assistance',
                content: [
                    { type: 'paragraph', text: "In an emergency on the mountain, follow your guide's instructions and the park's evacuation protocol, and contact the DENR/PAMB Local Office at the earliest opportunity. Park staff coordinate search and rescue response." },
                ],
            },
            {
                title: '8. Contact',
                content: [
                    { type: 'paragraph', text: 'For questions or to report outdated or inaccurate information, contact support@masaraga.gov.ph or the DENR/PAMB Local Office, Ligao City, Albay.' },
                ],
            },
        ],
    },
    'refund-policy': {
        label: 'Refund and Return Policy',
        title: 'Refund and Return Policy',
        subtitle: 'Cancellations, Fees, and Refund Terms',
        lastUpdated: '2026-09-18',
        enabled: true,
        showInFooter: true,
        introductoryContent: [],
        sections: [
            {
                title: '1. Overview',
                content: [
                    { type: 'paragraph', text: 'A confirmed booking reserves your slot, date, and trail. Once payment is completed, the booking is governed by the cancellation and refund terms described on this page. Please read these terms before confirming your payment.' },
                ],
            },
            {
                title: '2. Processing Fee',
                content: [
                    { type: 'paragraph', text: 'Every confirmed booking includes a processing fee of ₱50. This fee is non-refundable once the booking is confirmed, regardless of the reason for cancellation, except where the cancellation is initiated by park management.' },
                ],
            },
            {
                title: '3. Cancellation by the Visitor',
                content: [
                    { type: 'paragraph', text: 'If you cancel your booking before the scheduled climb date, the following terms apply:' },
                    {
                        type: 'list',
                        items: [
                            '48 hours or more before the scheduled climb date: a full refund of the base fee paid, minus the non-refundable processing fee.',
                            '24 to 48 hours before the scheduled climb date: a refund of 50% of the base fee paid, minus the non-refundable processing fee.',
                            'Less than 24 hours before the scheduled climb date or failure to appear at the trailhead on the date booked (no-show): no refund of any kind.',
                        ],
                    },
                    { type: 'paragraph', text: 'To cancel your booking, contact support@masaraga.gov.ph or reach the DENR/PAMB Local Office directly. Cancellation is effective only after you receive a confirmation of the cancellation by email or through the platform.' },
                ],
            },
            {
                title: '4. Cancellation by Park Management',
                content: [
                    { type: 'paragraph', text: 'The park management may cancel or reschedule your booking for safety, conservation, or operational reasons, including severe weather, trail damage, or emergency declarations. When a cancellation is initiated by the park, you are entitled to a full refund of all fees paid, including the processing fee.' },
                    { type: 'paragraph', text: 'Where possible, the park office will offer an alternative date or trail. If no suitable alternative is available, a refund will be processed as described in this policy.' },
                ],
            },
            {
                title: '5. How Refunds Are Issued',
                content: [
                    {
                        type: 'list',
                        items: [
                            'Refunds are returned to the original payment method used at the time of booking (GCash, Maya, or Landbank).',
                            'Refunds are processed within 7 to 14 banking days after your cancellation is confirmed.',
                            'Delays caused by the payment provider are outside our control, but park staff will assist in following up on delayed refunds when needed.',
                        ],
                    },
                ],
            },
            {
                title: '6. No-Show or Failure to Check In',
                content: [
                    { type: 'paragraph', text: 'A no-show occurs when a confirmed booking is not claimed at the trailhead on the booked date and time. No-shows are treated as a cancellation less than 24 hours before the scheduled climb and are not eligible for a refund of any kind.' },
                ],
            },
            {
                title: '7. Changes to Trail or Date',
                content: [
                    { type: 'paragraph', text: 'If you wish to change your trail or date after a booking is confirmed, contact support@masaraga.gov.ph. Changes are subject to availability and park management approval. Where the base fee for the new date or trail is lower, the difference is refunded. Where the fee is higher, you will be asked to pay the difference before the change is confirmed.' },
                ],
            },
            {
                title: '8. Failed or Duplicate Payments',
                content: [
                    { type: 'paragraph', text: 'If a payment fails or is duplicated due to a technical error, contact support@masaraga.gov.ph with your booking reference. Verified duplicate payments will be refunded in full, including the processing fee, within 7 to 14 banking days.' },
                ],
            },
            {
                title: '9. Contact',
                content: [
                    { type: 'paragraph', text: 'For questions about a refund or return request, contact support@masaraga.gov.ph or the DENR/PAMB Local Office, Ligao City, Albay.' },
                ],
            },
        ],
    },
};

export const ADMIN_SETTINGS = {
    general: {
        siteName: 'Mt. Masaraga Protected Landscape',
        officeName: 'DENR/PAMB Local Office',
        officeAddress: 'Brgy. Amtic, Ligao City, Albay',
        officeHours: 'Monday to Friday, 8:00 AM to 5:00 PM',
    },
    contact: {
        supportEmail: 'support@masaraga.gov.ph',
        officePhone: '+63 (52) 123-4567',
        emergencyPhone: '+63 917-EMS-SAFE',
        emergencyAvailability: 'Available 24/7 for active hikers',
        mapUrl: 'https://maps.app.goo.gl/393u11nnWZpdLjB69',
        latitude: 13.31859,
        longitude: 123.59756,
        facebook: 'https://m.me/MtMasaragaProtectedLandscape',
        instagram: '',
        x: '',
    },
    booking: {
        baseFeePerPax: 500,
        environmentalFee: 250,
        processingFee: 50,
        guideFeePerGroup: 700,
        defaultDailyCapacity: 30,
        guideRatio: 5,
        maxGroupSize: 5,
    },
    maintenance: {
        enabled: false,
        title: 'System Under Maintenance',
        message: 'The Mt. Masaraga Protected Landscape booking portal is currently undergoing scheduled upgrades to improve system reliability and security.',
        estimatedCompletion: '2-4 hours',
    },
    legal: LEGAL_PAGES,
    utility: {
        notFound: {
            title: "You've Wandered Off the Trail!",
            message: "Looks like you took a wrong turn at the trailhead. The page or route you are searching for has been moved, closed, or doesn't exist.",
            enabled: true,
        },
        accessDenied: {
            title: 'Clearance Required',
            message: 'This area requires an active LGU/DENR permit clearance or verified ranger credentials to view.',
            enabled: true,
        },
        bookingSuspended: {
            enabled: false,
            title: 'Booking Suspended',
            message: 'New climb reservations are temporarily paused while the park office updates schedules and safety information.',
            reopenNote: 'Please check back for updates on our announcement.',
        },
    },
};

export const ADMIN_ANNOUNCEMENTS = [
    {
        id: 'ANN-2026-1015-01',
        title: 'Trail Maintenance Schedule - October 2026',
        category: 'Advisory',
        audience: 'all',
        content: 'Please be advised that scheduled maintenance will be conducted on the Amtic Trail from October 28-30, 2026. During this period, the lower loop and wooden boardwalk sections will be temporarily closed for repairs. Hikers are advised to use the Ridge Trail connection as an alternative route. We apologize for any inconvenience and appreciate your understanding as we work to improve trail safety.',
        status: 'sent',
        createdAt: '2026-10-15T08:00:00.000Z',
        sentAt: '2026-10-15T08:00:00.000Z',
        author: 'Juan Dela Cruz',
    },
    {
        id: 'ANN-2026-1020-02',
        title: 'New Online Permit System Now Live',
        category: 'Update',
        audience: 'hikers',
        content: 'We are excited to announce that our new Online Permit System is now live! Hikers can now book permits, receive digital QR passes, and make payments through GCash and Maya directly from our website. The system features instant approval for standard permits, downloadable e-passes, and integrated payment methods. Visit the booking page to experience the streamlined process.',
        status: 'sent',
        createdAt: '2026-10-20T10:30:00.000Z',
        sentAt: '2026-10-20T10:30:00.000Z',
        author: 'Juan Dela Cruz',
    },
    {
        id: 'ANN-2026-1022-03',
        title: 'Weather Advisory: Typhoon Kristine',
        category: 'Weather',
        audience: 'all',
        content: 'PAGASA has raised Tropical Cyclone Wind Signal (TCWS) #1 for Albay Province due to Typhoon Kristine. As a precautionary measure, all trails in Mt. Masaraga Protected Landscape will be closed effective immediately until further notice. Affected bookings are eligible for free rescheduling within 6 months or a full refund. Please monitor official channels for updates.',
        status: 'sent',
        createdAt: '2026-10-22T14:00:00.000Z',
        sentAt: '2026-10-22T14:00:00.000Z',
        author: 'Juan Dela Cruz',
    },
    {
        id: 'ANN-2026-1023-04',
        title: 'Staff Meeting - Trail Safety Protocols',
        category: 'Announcement',
        audience: 'staff',
        content: 'Reminder to all park staff and guides: Monthly safety protocol review meeting scheduled for October 25, 2026 at 9:00 AM at the Ranger Station. Agenda includes emergency response procedures, first aid refresher, and updated trail condition reporting. Attendance is mandatory for all active guides. Please bring your certification cards for verification.',
        status: 'draft',
        createdAt: '2026-10-23T09:00:00.000Z',
        sentAt: null,
        author: 'Maria Santos',
    },
    {
        id: 'ANN-2026-1024-05',
        title: 'Year-End Report Submission',
        category: 'Announcement',
        audience: 'admins',
        content: 'All department heads are required to submit their year-end reports by November 15, 2026. Reports should include: visitor statistics, revenue breakdown, trail condition assessments, incident reports, and 2027 projections. Templates have been distributed via email. Please coordinate with the admin office for any clarifications.',
        status: 'draft',
        createdAt: '2026-10-24T11:00:00.000Z',
        sentAt: null,
        author: 'Juan Dela Cruz',
    },
];




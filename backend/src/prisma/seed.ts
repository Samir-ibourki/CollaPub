import bcrypt from "bcryptjs";
import prisma from "./client.js";

async function main() {
  // start database seeding process
  console.log("seeding database with moroccan demo data...");

  // clear existing data in correct relational order
  await prisma.notification.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.collaboration.deleteMany();
  await prisma.post.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.socialAccount.deleteMany();
  await prisma.creatorProfile.deleteMany();
  await prisma.brandProfile.deleteMany();
  await prisma.user.deleteMany();

  // default password for all seed accounts
  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. create creator users
  // creator 1: salma benani (fashion, casablanca)
  const creatorUser1 = await prisma.user.create({
    data: {
      email: "salma.fashion@collapub.ma",
      fullName: "Salma Benani",
      passwordHash,
      phoneNumber: "+212661122334",
      role: "CREATOR",
      creatorProfile: {
        create: {
          bio: "Créatrice de contenu mode & lifestyle basée à Casablanca. Spécialisée dans les looks chics et les collaborations avec marques marocaines et internationales.",
          avatarUrl:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
          coverImageUrl:
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200",
          city: "Casablanca",
          country: "Morocco",
          categories: ["Fashion", "Lifestyle", "Beauty"],
          languages: ["Darija", "French", "English"],
          collaborationTypes: ["Reels", "Stories", "Shooting", "Events"],
          isVerified: true,
          socialAccounts: {
            create: [
              {
                platform: "INSTAGRAM",
                handle: "@salma.style",
                profileUrl: "https://instagram.com/salma.style",
                followersCount: 145000,
                engagementRate: 4.8,
              },
              {
                platform: "TIKTOK",
                handle: "@salma.mode",
                profileUrl: "https://tiktok.com/@salma.mode",
                followersCount: 220000,
                engagementRate: 6.2,
              },
            ],
          },
          portfolioItems: {
            create: [
              {
                title: "Campagne Ramadan Caftan Chic",
                brandName: "Maison du Caftan",
                description: "Reel vidéo présentant la nouvelle collection de caftans modernes.",
                mediaUrl:
                  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800",
                platform: "INSTAGRAM",
              },
            ],
          },
        },
      },
    },
    include: { creatorProfile: true },
  });

  // creator 2: yassine food (foodie, marrakech)
  const creatorUser2 = await prisma.user.create({
    data: {
      email: "yassine.food@collapub.ma",
      fullName: "Yassine El Amrani",
      passwordHash,
      phoneNumber: "+212662233445",
      role: "CREATOR",
      creatorProfile: {
        create: {
          bio: "Passionné de gastronomie marocaine et adresses street food à Marrakech. Je fais découvrir les meilleures pépites culinaires.",
          avatarUrl:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
          coverImageUrl:
            "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=1200",
          city: "Marrakech",
          country: "Morocco",
          categories: ["Food", "Travel", "Culture"],
          languages: ["Darija", "French", "Arabic"],
          collaborationTypes: ["Reels", "Review", "Stories"],
          isVerified: true,
          socialAccounts: {
            create: [
              {
                platform: "INSTAGRAM",
                handle: "@yassine_eats",
                profileUrl: "https://instagram.com/yassine_eats",
                followersCount: 89000,
                engagementRate: 5.4,
              },
              {
                platform: "TIKTOK",
                handle: "@yassine.foodie",
                profileUrl: "https://tiktok.com/@yassine.foodie",
                followersCount: 175000,
                engagementRate: 7.1,
              },
            ],
          },
        },
      },
    },
    include: { creatorProfile: true },
  });

  // creator 3: amine tech (tech reviewer, rabat)
  await prisma.user.create({
    data: {
      email: "amine.tech@collapub.ma",
      fullName: "Amine Tazi",
      passwordHash,
      phoneNumber: "+212663344556",
      role: "CREATOR",
      creatorProfile: {
        create: {
          bio: "Tech reviewer & setup enthusiast basé à Rabat. Unboxings, smartphones et tests high-tech au Maroc.",
          avatarUrl:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
          coverImageUrl:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200",
          city: "Rabat",
          country: "Morocco",
          categories: ["Tech", "Gaming"],
          languages: ["Darija", "French", "English"],
          collaborationTypes: ["Reels", "Unboxing", "Product Review"],
          isVerified: false,
          socialAccounts: {
            create: [
              {
                platform: "YOUTUBE",
                handle: "AmineTechReviews",
                profileUrl: "https://youtube.com/@AmineTechReviews",
                followersCount: 65000,
                engagementRate: 8.5,
              },
              {
                platform: "INSTAGRAM",
                handle: "@aminetech",
                profileUrl: "https://instagram.com/aminetech",
                followersCount: 42000,
                engagementRate: 4.1,
              },
            ],
          },
        },
      },
    },
  });

  // 2. create brand users
  // brand 1: argan pure maroc (cosmetics, casablanca)
  const brandUser1 = await prisma.user.create({
    data: {
      email: "contact@arganpure.ma",
      fullName: "Argan Pure Cosmetics",
      passwordHash,
      phoneNumber: "+212522112233",
      role: "BRAND",
      brandProfile: {
        create: {
          companyName: "Argan Pure Maroc",
          industry: "Cosmetics & Skincare",
          logoUrl:
            "https://images.unsplash.com/photo-1608248597359-2b04c8f5f65b?w=400",
          city: "Casablanca",
          country: "Morocco",
          website: "https://arganpure.ma",
          description:
            "Marque marocaine 100% bio spécialisée dans les soins naturels à base d'huile d'argan certifiée d'Essaouira.",
        },
      },
    },
    include: { brandProfile: true },
  });

  // brand 2: kaftan luxury (fashion, marrakech)
  const brandUser2 = await prisma.user.create({
    data: {
      email: "collab@kaftanluxury.ma",
      fullName: "Kaftan Luxury Marrakech",
      passwordHash,
      phoneNumber: "+212524334455",
      role: "BRAND",
      brandProfile: {
        create: {
          companyName: "Kaftan Luxury",
          industry: "Haute Couture & Mode",
          logoUrl:
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400",
          city: "Marrakech",
          country: "Morocco",
          website: "https://kaftanluxury.com",
          description:
            "Maison de haute couture marocaine alliant tradition et modernité pour cérémonies et mariages d'exception.",
        },
      },
    },
    include: { brandProfile: true },
  });

  // 3. create commercial posts for discovery feed
  // post 1 by brand argan pure
  await prisma.post.create({
    data: {
      authorId: brandUser1.id,
      authorRole: "BRAND",
      title: "Nouvelle gamme Sérum Éclat Argan & Vitamine C",
      caption:
        "Découvrez notre nouveau sérum bio éclat 🌿 Nous recherchons 3 créatrices de contenu beauté à Casablanca et Marrakech pour notre campagne de lancement estivale.",
      mediaUrls: [
        "https://images.unsplash.com/photo-1608248597359-2b04c8f5f65b?w=800",
      ],
      mediaType: "IMAGE",
      category: "Beauty",
      city: "Casablanca",
      tags: ["skincare", "argan", "moroccanbeauty", "collab"],
      likesCount: 42,
      viewsCount: 520,
    },
  });

  // post 2 by creator salma benani
  await prisma.post.create({
    data: {
      authorId: creatorUser1.id,
      authorRole: "CREATOR",
      title: "Summer Caftan Vibe au Riad Yasmine",
      caption:
        "Shooting réalisé au coeur de la Médina de Marrakech ✨ Ouverte pour de nouvelles collaborations avec des marques de mode locales pour la saison estivale.",
      mediaUrls: [
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800",
      ],
      mediaType: "IMAGE",
      category: "Fashion",
      city: "Marrakech",
      tags: ["caftan", "moroccanfashion", "style", "collab"],
      likesCount: 189,
      viewsCount: 1420,
    },
  });

  // post 3 by creator yassine food
  await prisma.post.create({
    data: {
      authorId: creatorUser2.id,
      authorRole: "CREATOR",
      title: "Top 5 Adresses Street Food à Jamaa El Fna",
      caption:
        "Nouvelle vidéo dégustation au coeur de Marrakech 🍲 Contactez-moi en privé pour mettre en valeur vos restaurants ou produits du terroir marocain.",
      mediaUrls: [
        "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800",
      ],
      mediaType: "IMAGE",
      category: "Food",
      city: "Marrakech",
      tags: ["foodie", "marrakech", "moroccanfood", "review"],
      likesCount: 230,
      viewsCount: 2100,
    },
  });

  // post 4 by brand kaftan luxury
  await prisma.post.create({
    data: {
      authorId: brandUser2.id,
      authorRole: "BRAND",
      title: "Collection Mariage 2026 en Préparation",
      caption:
        "Notre nouvelle collection capsule est presque prête 👰 Nous invitons les créateurs lifestyle et mode pour une session shooting exclusive à Marrakech.",
      mediaUrls: [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
      ],
      mediaType: "IMAGE",
      category: "Fashion",
      city: "Marrakech",
      tags: ["mariage", "caftan", "haute_couture", "marrakech"],
      likesCount: 95,
      viewsCount: 880,
    },
  });

  // 4. create a sample collaboration proposal
  const collaboration = await prisma.collaboration.create({
    data: {
      brandProfileId: brandUser1.brandProfile!.id,
      creatorProfileId: creatorUser1.creatorProfile!.id,
      title: "Campagne Lancement Sérum Éclat",
      description:
        "Bonjour Salma, nous adorons votre univers et souhaitons vous proposer un partenariat pour le lancement de notre sérum bio avec un Reel dédié et deux stories.",
      deliverables: [
        "1 Reel Instagram dédié au produit",
        "2 Stories avec lien direct vers le shop",
      ],
      proposedBudget: 4500,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: "PENDING",
    },
  });

  // 5. create in-app notification for the creator
  await prisma.notification.create({
    data: {
      userId: creatorUser1.id,
      type: "NEW_COLLABORATION_REQUEST",
      title: "Nouvelle proposition de collaboration",
      message:
        'Argan Pure Maroc vous a envoyé une proposition de partenariat: "Campagne Lancement Sérum Éclat"',
      metadata: {
        collaborationId: collaboration.id,
        brandProfileId: brandUser1.brandProfile!.id,
      },
    },
  });

  // 6. create a favorite / shortlist bookmark by brand
  await prisma.favorite.create({
    data: {
      brandProfileId: brandUser1.brandProfile!.id,
      creatorProfileId: creatorUser1.creatorProfile!.id,
    },
  });

  console.log("database seeded successfully with moroccan creators and brands!");
}

main()
  .catch((e) => {
    console.error("seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Enhanced Product Database with Dubois Beauty Branding
const productDatabase = {
  cleansers: {
    dry: {
      product: "Dubois Hydrating Ceramide Cleanser",
      description: "Luxurious gentle formula that maintains skin's natural moisture barrier without stripping",
      instructions: "Apply to damp skin using upward circular motions for 60 seconds, rinse with lukewarm water",
      benefits: ["Deep hydration", "Barrier protection", "Non-stripping"]
    },
    oily: {
      product: "Dubois Purifying Salicylic Acid Cleanser",
      description: "Advanced oil-control formula that deeply cleanses pores and regulates sebum production",
      instructions: "Massage onto damp skin focusing on T-zone, rinse thoroughly with warm water",
      benefits: ["Pore refinement", "Oil control", "Blemish prevention"]
    },
    combination: {
      product: "Dubois Balancing Gel-to-Foam Cleanser",
      description: "Smart formula that adapts to different skin zones for perfect balance",
      instructions: "Apply to dry hands, emulsify with water, massage face in circular motions",
      benefits: ["Zone-specific care", "pH balancing", "Gentle cleansing"]
    },
    normal: {
      product: "Dubois Nourishing Cream Cleanser",
      description: "All-in-one luxurious cleanser that maintains skin's perfect equilibrium",
      instructions: "Use morning and evening with gentle circular motions, pat dry with soft towel",
      benefits: ["Maintains balance", "Softens skin", "Prepares for treatment"]
    },
    sensitive: {
      product: "Dubois Soothing Oat Milk Cleanser",
      description: "Ultra-gentle, fragrance-free formula for delicate and reactive skin types",
      instructions: "Apply with fingertips using light pressure, rinse with cool water",
      benefits: ["Calms irritation", "Strengthens barrier", "Hypoallergenic"]
    }
  },

  toners: {
    dry: {
      product: "Dubois Hydra-Revival Toner",
      description: "Alcohol-free hydrating toner with hyaluronic acid and ceramides",
      instructions: "Press into skin with palms or apply with cotton pad, no need to wipe off",
      benefits: ["Intense hydration", "Plumping effect", "Prepares for serums"]
    },
    oily: {
      product: "Dubois Pore-Perfect Toner",
      description: "Mattifying toner with niacinamide and zinc for refined pores",
      instructions: "Swipe across face with cotton pad, focus on T-zone areas",
      benefits: ["Pore minimization", "Oil control", "Smoothing"]
    },
    combination: {
      product: "Dubois Balance Harmony Toner",
      description: "Dual-phase toner that hydrates dry areas while controlling oil",
      instructions: "Shake well, apply evenly across face with focusing hydration on cheeks",
      benefits: ["Multi-zone care", "Balance restoration", "Texture refinement"]
    },
    normal: {
      product: "Dubois Rose Quartz Elixir",
      description: "Luxurious rose water mist with quartz-infused hydration",
      instructions: "Spray onto face after cleansing, allow to absorb naturally",
      benefits: ["Radiance boost", "Light hydration", "Aromatherapy benefits"]
    },
    sensitive: {
      product: "Dubois Calm Relief Toner",
      description: "Soothing toner with centella asiatica and chamomile extracts",
      instructions: "Pat gently onto skin, avoid rubbing sensitive areas",
      benefits: ["Redness reduction", "Barrier support", "Instant calming"]
    }
  },

  serums: {
    acne: {
      product: "Dubois Blemish Control Elixir",
      description: "Powerful 2% salicylic acid serum with tea tree and zinc",
      instructions: "Apply to cleansed skin, focus on affected areas, let absorb completely",
      benefits: ["Targeted treatment", "Inflammation reduction", "Pore purification"]
    },
    aging: {
      product: "Dubois Age-Reverse Complex",
      description: "Advanced retinol and peptide serum for wrinkle reduction",
      instructions: "Use in evening routine 2-3 times weekly, build up gradually",
      benefits: ["Collagen boost", "Line reduction", "Firmness improvement"]
    },
    darkSpots: {
      product: "Dubois Radiance Renewal Serum",
      description: "Brightening serum with vitamin C and tranexamic acid",
      instructions: "Apply in morning before moisturizer, always follow with SPF",
      benefits: ["Hyperpigmentation fading", "Even tone", "Radiance enhancement"]
    },
    redness: {
      product: "Dubois Sensitive Relief Serum",
      description: "Calming serum with centella and azelaic acid complex",
      instructions: "Apply morning and evening with gentle patting motion",
      benefits: ["Redness calming", "Barrier repair", "Comfort restoration"]
    },
    dryness: {
      product: "Dubois Intensive Hydration Booster",
      description: "Multi-molecular hyaluronic acid with ceramide complex",
      instructions: "Apply to damp skin, layer under moisturizer for enhanced effect",
      benefits: ["Deep hydration", "Moisture lock", "Plumping effect"]
    },
    oiliness: {
      product: "Dubois Oil-Control Solution",
      description: "Niacinamide and zinc serum for sebum regulation",
      instructions: "Apply to entire face, extra attention to oily zones",
      benefits: ["Sebum regulation", "Pore refinement", "Matte finish"]
    }
  },

  moisturizers: {
    dry: {
      product: "Dubois Intensive Renewal Cream",
      description: "Rich ceramide-infused cream for overnight repair and hydration",
      instructions: "Apply generous amount in evening, massage upward until fully absorbed",
      benefits: ["Overnight repair", "Intense moisture", "Barrier restoration"]
    },
    oily: {
      product: "Dubois Oil-Free Hydration Gel",
      description: "Lightweight water-based gel that hydrates without heaviness",
      instructions: "Small pea-sized amount morning and evening, avoid over-application",
      benefits: ["Weightless hydration", "Non-comedogenic", "Matte finish"]
    },
    combination: {
      product: "Dubois Smart Balance Cream",
      description: "Intelligent formula that adapts to different facial zones",
      instructions: "Apply more generously to dry areas, lighter on oily zones",
      benefits: ["Zone-specific care", "Balance maintenance", "Comfort all day"]
    },
    normal: {
      product: "Dubois Daily Nourishment Cream",
      description: "All-purpose luxurious cream with multi-vitamin complex",
      instructions: "Apply twice daily using upward sweeping motions",
      benefits: ["Complete nourishment", "Radiance boost", "Protection"]
    },
    sensitive: {
      product: "Dubois Barrier Repair Cream",
      description: "Hypoallergenic formula that strengthens and protects sensitive skin",
      instructions: "Gentle application, avoid rubbing on irritated areas",
      benefits: ["Barrier strengthening", "Sensitivity reduction", "Comfort"]
    }
  },

  sunscreens: {
    dry: {
      product: "Dubois Hydrating Sun Shield SPF 50",
      description: "Moisturizing sunscreen with hyaluronic acid and antioxidant protection",
      instructions: "Apply as final morning step, reapply every 2 hours when outdoors",
      benefits: ["Hydration + protection", "Anti-pollution", "Comfort wear"]
    },
    oily: {
      product: "Dubois Matte Perfect SPF 50",
      description: "Oil-control sunscreen with invisible matte finish",
      instructions: "Use after moisturizer, perfect base under makeup",
      benefits: ["Shine control", "Non-greasy", "Pore-blurring"]
    },
    combination: {
      product: "Dubois Universal Defense SPF 50",
      description: "Lightweight universal protection suitable for all skin zones",
      instructions: "Even application, don't forget neck and ears",
      benefits: ["Broad spectrum", "Lightweight", "All-zone suitable"]
    },
    normal: {
      product: "Dubois Daily Guard SPF 50",
      description: "Comprehensive UVA/UVB protection with environmental defense",
      instructions: "Apply generously 15 minutes before sun exposure",
      benefits: ["Complete protection", "Anti-aging", "Environmental shield"]
    },
    sensitive: {
      product: "Dubois Mineral Comfort SPF 50",
      description: "Physical sunscreen with zinc oxide for reactive skin",
      instructions: "Gentle application, suitable for even the most sensitive skin",
      benefits: ["Physical protection", "Gentle formula", "Immediate efficacy"]
    }
  }
};

// Enhanced Algorithm with Better Personalization
export const generateSkincareRoutine = (skinType, concerns, morningTime, eveningTime) => {
  const routine = {
    skinType,
    concerns,
    schedule: {
      morning: morningTime,
      evening: eveningTime
    },
    products: {},
    weeklySchedule: {},
    instructions: {},
    personalizedTips: []
  };

  // Core products based on skin type
  routine.products.cleanser = productDatabase.cleansers[skinType];
  routine.products.toner = productDatabase.toners[skinType];
  routine.products.moisturizer = productDatabase.moisturizers[skinType];
  routine.products.sunscreen = productDatabase.sunscreens[skinType];

  // Targeted serums based on concerns
  routine.products.serums = [];
  concerns.forEach(concern => {
    if (productDatabase.serums[concern]) {
      routine.products.serums.push(productDatabase.serums[concern]);
    }
  });

  // Weekly treatment schedule
  routine.weeklySchedule = generateWeeklySchedule(skinType, concerns);
  routine.instructions = generateDetailedInstructions(routine.products);
  routine.personalizedTips = generatePersonalizedTips(skinType, concerns);

  return routine;
};

const generateWeeklySchedule = (skinType, concerns) => {
  const baseSchedule = {
    monday: { 
      am: 'Cleanser, Toner, Serum, Moisturizer, SPF 50', 
      pm: 'Double Cleanse, Treatment Serum, Moisturizer',
      focus: 'Active Treatment Day'
    },
    tuesday: { 
      am: 'Cleanser, Toner, Serum, Moisturizer, SPF 50', 
      pm: 'Double Cleanse, Hydrating Serum, Moisturizer',
      focus: 'Hydration Boost'
    },
    wednesday: { 
      am: 'Cleanser, Toner, Serum, Moisturizer, SPF 50', 
      pm: 'Double Cleanse, Exfoliation Treatment, Recovery Serum',
      focus: 'Exfoliation & Renewal'
    },
    thursday: { 
      am: 'Cleanser, Toner, Serum, Moisturizer, SPF 50', 
      pm: 'Double Cleanse, Treatment Serum, Moisturizer',
      focus: 'Targeted Treatment'
    },
    friday: { 
      am: 'Cleanser, Toner, Serum, Moisturizer, SPF 50', 
      pm: 'Double Cleanse, Recovery Serum, Overnight Mask',
      focus: 'Weekend Prep & Recovery'
    },
    saturday: { 
      am: 'Cleanser, Toner, Soothing Serum, Moisturizer, SPF 30', 
      pm: 'Double Cleanse, Purifying Mask, Facial Oil',
      focus: 'Deep Treatment & Self-Care'
    },
    sunday: { 
      am: 'Cleanser, Toner, Hydrating Serum, Moisturizer, SPF 30', 
      pm: 'Double Cleanse, Hydrating Mask, Barrier Repair',
      focus: 'Restoration & Hydration'
    }
  };

  // Customizations based on skin type and concerns
  if (skinType === 'sensitive') {
    baseSchedule.wednesday.pm = 'Double Cleanse, Soothing Serum, Barrier Cream';
    baseSchedule.wednesday.focus = 'Gentle Care Day';
    baseSchedule.saturday.pm = 'Double Cleanse, Calming Mask, Recovery Balm';
  }

  if (concerns.includes('acne')) {
    baseSchedule.wednesday.pm = 'Double Cleanse, BHA Treatment, Oil-Free Moisturizer';
    baseSchedule.saturday.pm = 'Double Cleanse, Purifying Mask, Spot Treatment';
  }

  if (concerns.includes('aging')) {
    baseSchedule.monday.pm = 'Double Cleanse, Retinol Serum, Repair Cream';
    baseSchedule.wednesday.pm = 'Double Cleanse, AHA Treatment, Peptide Serum';
  }

  return baseSchedule;
};

const generateDetailedInstructions = (products) => {
  const instructions = {
    general: [
      "Always perform a patch test 24 hours before using new products",
      "Introduce one new product at a time, waiting 1-2 weeks between additions",
      "Consistency is key - follow your routine daily for optimal results",
      "Maintain a healthy lifestyle with balanced diet and adequate hydration"
    ],
    morning: [
      "Start with a clean face using your Dubois cleanser",
      products.cleanser.instructions,
      "Follow with toner to balance and prepare skin",
      products.toner.instructions,
      ...(products.serums ? products.serums.map(s => `Apply ${s.product}: ${s.instructions}`) : []),
      "Lock in hydration with moisturizer",
      products.moisturizer.instructions,
      "Finish with sunscreen for complete protection",
      products.sunscreen.instructions
    ],
    evening: [
      "First cleanse: Use oil-based cleanser to remove sunscreen and makeup",
      "Second cleanse: " + products.cleanser.instructions,
      "Tone to remove any residue and rebalance",
      products.toner.instructions,
      ...(products.serums ? products.serums.map(s => `Evening application: ${s.instructions}`) : []),
      "Nighttime moisturizer application: " + products.moisturizer.instructions
    ],
    weekly: [
      "Wednesday: Gentle exfoliation to remove dead skin cells",
      "Friday: Intensive overnight treatment for weekend recovery",
      "Saturday: Mask treatment for deep cleansing or hydration",
      "Sunday: Focus on barrier repair and skin restoration"
    ]
  };

  return instructions;
};

const generatePersonalizedTips = (skinType, concerns) => {
  const tips = [];
  
  // Skin type specific tips
  const skinTypeTips = {
    dry: [
      "Apply moisturizer to damp skin to lock in hydration",
      "Use a humidifier in your bedroom overnight",
      "Avoid very hot water when cleansing"
    ],
    oily: [
      "Don't skip moisturizer - dehydration can increase oil production",
      "Use blotting papers instead of powder throughout the day",
      "Clean your phone screen regularly to prevent bacterial transfer"
    ],
    combination: [
      "Apply different products to different zones as needed",
      "Use lighter textures on T-zone, richer formulas on cheeks",
      "Pay attention to seasonal changes in your skin's needs"
    ],
    normal: [
      "Focus on prevention and maintaining your skin's balance",
      "Don't over-complicate your routine - simplicity works best",
      "Regular professional facials can maintain optimal skin health"
    ],
    sensitive: [
      "Always patch test new products for 24-48 hours",
      "Keep a product diary to track reactions",
      "Avoid fragrance and essential oils in your products"
    ]
  };

  tips.push(...(skinTypeTips[skinType] || []));

  // Concern specific tips
  if (concerns.includes('acne')) {
    tips.push("Change pillowcases every 3-4 days", "Avoid touching your face throughout the day");
  }
  if (concerns.includes('aging')) {
    tips.push("Always wear sunscreen, even on cloudy days", "Sleep on your back to prevent sleep lines");
  }
  if (concerns.includes('darkSpots')) {
    tips.push("Be consistent with treatment - results take 8-12 weeks", "Never pick at dark spots or scabs");
  }

  return tips;
};

export const generateSkincarePDF = (userData, routine) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Color palette
      const colors = {
        primary: '#8B7355',      // Warm taupe
        secondary: '#A8C8B8',    // Soft sage green
        accent: '#D4A574',       // Warm beige
        dark: '#2C2C2C',         // Dark charcoal
        medium: '#666666',       // Medium gray
        light: '#888888',        // Light gray
        background: '#F8F6F2',   // Warm off-white
        border: '#E8DECD'        // Light beige border
      };

      // Header with background
      doc.rect(0, 0, doc.page.width, 120)
         .fillColor(colors.background)
         .fill();
      
      doc.fillColor(colors.primary)
         .fontSize(24)
         .font('Helvetica-Bold')
         .text('Your Personalized Skincare Timetable', 50, 50, { align: 'center' });
      
      doc.fillColor(colors.medium)
         .fontSize(12)
         .font('Helvetica')
         .text(`Created for ${userData.name} | ${new Date().toLocaleDateString()}`, 50, 85, { align: 'center' });

      // Skin Profile section
      doc.fillColor(colors.dark)
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('Skin Profile', 50, 150);
      
      doc.moveTo(50, 175).lineTo(550, 175).strokeColor(colors.secondary).lineWidth(2).stroke();
      
      // Profile content
      doc.fillColor(colors.dark)
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('Skin Type:', 50, 195);
      
      doc.fillColor(colors.medium)
         .font('Helvetica')
         .text(userData.skinType.charAt(0).toUpperCase() + userData.skinType.slice(1), 120, 195);
      
      doc.fillColor(colors.dark)
         .font('Helvetica-Bold')
         .text('Primary Concerns:', 50, 215);
      
      doc.fillColor(colors.medium)
         .font('Helvetica')
         .text(userData.concerns.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', '), 150, 215);
      
      doc.fillColor(colors.dark)
         .font('Helvetica-Bold')
         .text('Morning Routine:', 50, 235);
      
      doc.fillColor(colors.medium)
         .font('Helvetica')
         .text(userData.morningTime, 150, 235);
      
      doc.fillColor(colors.dark)
         .font('Helvetica-Bold')
         .text('Evening Routine:', 50, 255);
      
      doc.fillColor(colors.medium)
         .font('Helvetica')
         .text(userData.eveningTime, 150, 255);

      // Recommended Products with cards
      doc.addPage();
      
      // Page background
      doc.rect(0, 0, doc.page.width, doc.page.height)
         .fillColor(colors.background)
         .fill();
      
      doc.fillColor(colors.dark)
         .fontSize(18)
         .font('Helvetica-Bold')
         .text('Recommended Products', 50, 50);
      
      doc.moveTo(50, 80).lineTo(550, 80).strokeColor(colors.secondary).lineWidth(2).stroke();

      let yPosition = 100;
      
      // Safely iterate through products
      const productCategories = ['cleanser', 'toner', 'moisturizer', 'sunscreen'];
      productCategories.forEach(category => {
        const product = routine.products[category];
        if (product) {
          // Product card background
          doc.rect(50, yPosition - 5, 500, 45)
             .fillColor('#FFFFFF')
             .strokeColor(colors.border)
             .fill()
             .stroke();
          
          doc.fillColor(colors.primary)
             .fontSize(12)
             .font('Helvetica-Bold')
             .text(`${category.charAt(0).toUpperCase() + category.slice(1)}:`, 60, yPosition + 5);
          
          doc.fillColor(colors.dark)
             .fontSize(11)
             .font('Helvetica-Bold')
             .text(product.product, 150, yPosition + 5);
          
          doc.fillColor(colors.medium)
             .fontSize(9)
             .font('Helvetica')
             .text(product.description, 150, yPosition + 20, { width: 380 });
          
          yPosition += 60;
        }
      });

      // Serums section
      if (routine.products.serums && Array.isArray(routine.products.serums) && routine.products.serums.length > 0) {
        yPosition += 10;
        
        doc.fillColor(colors.dark)
           .fontSize(14)
           .font('Helvetica-Bold')
           .text('Targeted Serums', 50, yPosition);
        
        yPosition += 25;
        
        routine.products.serums.forEach(serum => {
          // Serum card background
          doc.rect(50, yPosition - 5, 500, 45)
             .fillColor('#FFFFFF')
             .strokeColor(colors.border)
             .fill()
             .stroke();
          
          doc.fillColor(colors.dark)
             .fontSize(11)
             .font('Helvetica-Bold')
             .text(serum.product, 60, yPosition + 5);
          
          doc.fillColor(colors.medium)
             .fontSize(9)
             .font('Helvetica')
             .text(serum.description, 60, yPosition + 20, { width: 470 });
          
          yPosition += 60;
        });
      }

      // Weekly Schedule with modern layout
      doc.addPage();
      
      // Page background
      doc.rect(0, 0, doc.page.width, doc.page.height)
         .fillColor(colors.background)
         .fill();
      
      doc.fillColor(colors.dark)
         .fontSize(18)
         .font('Helvetica-Bold')
         .text('7-Day Skincare Schedule', 50, 50);
      
      doc.moveTo(50, 80).lineTo(550, 80).strokeColor(colors.secondary).lineWidth(2).stroke();

      yPosition = 100;
      
      // Safely iterate through weekly schedule
      if (routine.weeklySchedule && typeof routine.weeklySchedule === 'object') {
        const days = Object.entries(routine.weeklySchedule);
        
        days.forEach(([day, routines], index) => {
          // Day card with alternating background
          const cardColor = index % 2 === 0 ? '#FFFFFF' : '#F8F6F2';
          
          doc.rect(50, yPosition, 500, 70)
             .fillColor(cardColor)
             .strokeColor(colors.border)
             .fill()
             .stroke();
          
          doc.fillColor(colors.primary)
             .fontSize(13)
             .font('Helvetica-Bold')
             .text(day.charAt(0).toUpperCase() + day.slice(1), 60, yPosition + 15);
          
          if (routines.am) {
            doc.fillColor(colors.dark)
               .fontSize(10)
               .font('Helvetica-Bold')
               .text('Morning:', 60, yPosition + 35);
            
            doc.fillColor(colors.medium)
               .font('Helvetica')
               .text(`${userData.morningTime}: ${routines.am}`, 120, yPosition + 35);
          }
          
          if (routines.pm) {
            doc.fillColor(colors.dark)
               .font('Helvetica-Bold')
               .text('Evening:', 60, yPosition + 50);
            
            doc.fillColor(colors.medium)
               .font('Helvetica')
               .text(`${userData.eveningTime}: ${routines.pm}`, 120, yPosition + 50);
          }
          
          yPosition += 85;
        });
      }

      // Instructions with safe iteration
      doc.addPage();
      
      // Page background
      doc.rect(0, 0, doc.page.width, doc.page.height)
         .fillColor(colors.background)
         .fill();
      
      doc.fillColor(colors.dark)
         .fontSize(18)
         .font('Helvetica-Bold')
         .text('Application Instructions', 50, 50);
      
      doc.moveTo(50, 80).lineTo(550, 80).strokeColor(colors.secondary).lineWidth(2).stroke();

      yPosition = 100;
      
      // Safely iterate through instructions
      if (routine.instructions && typeof routine.instructions === 'object') {
        Object.entries(routine.instructions).forEach(([category, instructionList]) => {
          // Check if instructionList is actually an array
          if (Array.isArray(instructionList)) {
            doc.fillColor(colors.primary)
               .fontSize(13)
               .font('Helvetica-Bold')
               .text(`${category.charAt(0).toUpperCase() + category.slice(1)}`, 50, yPosition);
            
            yPosition += 20;
            
            // Instructions box
            doc.rect(50, yPosition - 5, 500, instructionList.length * 25 + 10)
               .fillColor('#FFFFFF')
               .strokeColor(colors.border)
               .fill()
               .stroke();
            
            instructionList.forEach(instruction => {
              doc.fillColor(colors.medium)
                 .fontSize(10)
                 .font('Helvetica')
                 .text(`• ${instruction}`, 60, yPosition, { width: 470 });
              yPosition += 20;
            });
            yPosition += 20;
          }
        });
      }

      // Elegant footer
      doc.fillColor(colors.light)
         .fontSize(9)
         .font('Helvetica-Oblique')
         .text('Generated by Dubois Beauty | Consult a dermatologist for serious skin concerns', 
               50, doc.page.height - 50, { align: 'center' });

      doc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};




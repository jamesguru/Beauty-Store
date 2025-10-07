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
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Dubois Beauty Color Palette
      const colors = {
        primary: '#8B7355',
        secondary: '#A8C8B8',
        accent: '#D4A574',
        dark: '#2C2C2C',
        medium: '#666666',
        light: '#888888',
        background: '#F8F6F2',
        border: '#E8DECD',
        highlight: '#FFF9F0'
      };

      // Add watermark function
      const addWatermark = () => {
        doc.save();
        doc.translate(doc.page.width / 2, doc.page.height / 2);
        doc.rotate(-45);
        doc.fillColor(colors.light).opacity(0.03);
        doc.fontSize(72);
        doc.font('Helvetica-Bold');
        doc.text('DUBOIS BEAUTY', -350, 0, { width: 700, align: 'center' });
        doc.restore();
      };

      // Header with compact design
      doc.rect(0, 0, doc.page.width, 100).fillColor(colors.background).fill();
      addWatermark();
      
      let yPosition = 45;

      doc.fillColor(colors.primary)
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('DUBOIS BEAUTY', 50, yPosition);
      
      yPosition += 25;

      doc.fillColor(colors.dark)
         .fontSize(20)
         .font('Helvetica-Bold')
         .text('Personalized Skincare Journey', 50, yPosition, { align: 'center' });
      
      yPosition += 25;

      doc.fillColor(colors.medium)
         .fontSize(10)
         .font('Helvetica')
         .text(`Created for ${userData.name} | ${new Date().toLocaleDateString()}`, 50, yPosition, { align: 'center' });

      yPosition += 40;

      // Skin Profile - Compact section
      doc.fillColor(colors.dark)
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('Skin Profile', 50, yPosition);
      
      doc.moveTo(50, yPosition + 20).lineTo(550, yPosition + 20).strokeColor(colors.secondary).lineWidth(2).stroke();
      
      yPosition += 35;

      // Compact profile layout
      const profileData = [
        { label: 'Skin Type', value: userData.skinType.charAt(0).toUpperCase() + userData.skinType.slice(1) },
        { label: 'Primary Concerns', value: userData.concerns.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ') },
        { label: 'Morning Routine', value: userData.morningTime },
        { label: 'Evening Routine', value: userData.eveningTime }
      ];

      profileData.forEach((item, index) => {
        const rowY = yPosition + (index * 18);
        doc.fillColor(colors.dark)
           .fontSize(10)
           .font('Helvetica-Bold')
           .text(`${item.label}:`, 50, rowY);
        
        doc.fillColor(colors.medium)
           .font('Helvetica')
           .text(item.value, 140, rowY, { width: 400 });
      });

      yPosition += 100;

      // Focus Areas if available and space permits
      if (routine.focusAreas && routine.focusAreas.length > 0 && yPosition < 650) {
        doc.fillColor(colors.dark)
           .fontSize(12)
           .font('Helvetica-Bold')
           .text('Treatment Focus:', 50, yPosition);
        
        yPosition += 20;
        
        let tagX = 50;
        routine.focusAreas.forEach((focus) => {
          const tagWidth = doc.widthOfString(focus) + 16;
          if (tagX + tagWidth > 500) {
            tagX = 50;
            yPosition += 25;
          }
          
          doc.rect(tagX, yPosition, tagWidth, 20)
             .fillColor(colors.secondary).fill();
          doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold')
             .text(focus, tagX + 8, yPosition + 6);
          
          tagX += tagWidth + 8;
        });
        
        yPosition += 30;
      }

      // Check if we need new page for products
      if (yPosition > 600) {
        doc.addPage();
        addWatermark();
        yPosition = 50;
      } else {
        yPosition += 20;
      }

      // Recommended Products - Compact design
      doc.fillColor(colors.dark)
         .fontSize(18)
         .font('Helvetica-Bold')
         .text('Recommended Products', 50, yPosition);
      
      doc.moveTo(50, yPosition + 20).lineTo(550, yPosition + 20).strokeColor(colors.secondary).lineWidth(2).stroke();
      
      yPosition += 40;

      // Core products - compact cards
      const productCategories = ['cleanser', 'toner', 'moisturizer', 'sunscreen'];
      productCategories.forEach((category, index) => {
        const product = routine.products[category];
        if (product) {
          // Check page space
          if (yPosition > 650) {
            doc.addPage();
            addWatermark();
            yPosition = 50;
          }

          const cardHeight = 40;
          doc.rect(50, yPosition, 500, cardHeight)
             .fillColor(index % 2 === 0 ? '#FFFFFF' : colors.highlight)
             .strokeColor(colors.border)
             .fill()
             .stroke();
          
          doc.fillColor(colors.primary)
             .fontSize(9)
             .font('Helvetica-Bold')
             .text(category.toUpperCase(), 60, yPosition + 8);
          
          doc.fillColor(colors.dark)
             .fontSize(10)
             .font('Helvetica-Bold')
             .text(product.product, 120, yPosition + 8, { width: 370 });
          
          yPosition += cardHeight + 8;
        }
      });

      // Serums section - compact
      if (routine.products.serums && routine.products.serums.length > 0) {
        yPosition += 10;
        
        if (yPosition > 600) {
          doc.addPage();
          addWatermark();
          yPosition = 50;
        }

        doc.fillColor(colors.dark)
           .fontSize(14)
           .font('Helvetica-Bold')
           .text('Treatment Serums', 50, yPosition);
        
        yPosition += 25;
        
        routine.products.serums.forEach((serum, index) => {
          if (yPosition > 650) {
            doc.addPage();
            addWatermark();
            yPosition = 50;
          }

          const cardHeight = 35;
          doc.rect(50, yPosition, 500, cardHeight)
             .fillColor(index % 2 === 0 ? '#FFFFFF' : colors.highlight)
             .strokeColor(colors.border)
             .fill()
             .stroke();
          
          doc.fillColor(colors.dark)
             .fontSize(9)
             .font('Helvetica-Bold')
             .text(serum.product, 60, yPosition + 8, { width: 430 });
          
          if (serum.usageFrequency) {
            doc.fillColor(colors.medium)
               .fontSize(7)
               .font('Helvetica')
               .text(serum.usageFrequency, 400, yPosition + 8);
          }
          
          yPosition += cardHeight + 8;
        });
      }

      // Weekly Schedule - Start new page only when needed
      if (yPosition > 550) {
        doc.addPage();
        addWatermark();
        yPosition = 50;
      } else {
        yPosition += 20;
      }

      doc.fillColor(colors.dark)
         .fontSize(18)
         .font('Helvetica-Bold')
         .text('7-Day Skincare Schedule', 50, yPosition, { align: 'center' });
      
      doc.moveTo(50, yPosition + 25).lineTo(550, yPosition + 25).strokeColor(colors.secondary).lineWidth(2).stroke();
      
      yPosition += 45;

      // Compact weekly schedule
      if (routine.weeklySchedule) {
        const days = Object.entries(routine.weeklySchedule);
        
        days.forEach(([day, routines], index) => {
          // Check page space before adding new day
          if (yPosition > 650) {
            doc.addPage();
            addWatermark();
            yPosition = 50;
          }

          const cardHeight = 70;
          const cardColor = index % 2 === 0 ? '#FFFFFF' : colors.highlight;
          
          doc.rect(50, yPosition, 500, cardHeight)
             .fillColor(cardColor)
             .strokeColor(colors.border)
             .fill()
             .stroke();
          
          // Compact day header
          doc.rect(50, yPosition, 100, cardHeight).fillColor(colors.primary).fill();
          doc.fillColor('#FFFFFF')
             .fontSize(11)
             .font('Helvetica-Bold')
             .text(day.charAt(0).toUpperCase() + day.slice(1), 55, yPosition + 25, { width: 90, align: 'center' });

          const contentX = 160;
          
          // Focus area
          if (routines.focus) {
            doc.fillColor(colors.dark)
               .fontSize(10)
               .font('Helvetica-Bold')
               .text(routines.focus, contentX, yPosition + 10, { width: 340 });
          }
          
          // Morning routine
          if (routines.am) {
            doc.fillColor(colors.medium)
               .fontSize(8)
               .font('Helvetica-Bold')
               .text('AM:', contentX, yPosition + 28);
            
            doc.fillColor(colors.dark)
               .fontSize(7)
               .font('Helvetica')
               .text(routines.am, contentX + 25, yPosition + 28, { width: 315 });
          }
          
          // Evening routine
          if (routines.pm) {
            doc.fillColor(colors.medium)
               .fontSize(8)
               .font('Helvetica-Bold')
               .text('PM:', contentX, yPosition + 45);
            
            doc.fillColor(colors.dark)
               .fontSize(7)
               .font('Helvetica')
               .text(routines.pm, contentX + 25, yPosition + 45, { width: 315 });
          }
          
          yPosition += cardHeight + 10;
        });
      }

      // Instructions and Tips - Combined on one page
      doc.addPage();
      addWatermark();
      yPosition = 50;

      doc.fillColor(colors.dark)
         .fontSize(18)
         .font('Helvetica-Bold')
         .text('Application Guide & Tips', 50, yPosition, { align: 'center' });
      
      doc.moveTo(50, yPosition + 25).lineTo(550, yPosition + 25).strokeColor(colors.secondary).lineWidth(2).stroke();
      
      yPosition += 45;

      // Morning Instructions - Only if space allows
      if (routine.instructions.morning) {
        doc.fillColor(colors.primary)
           .fontSize(12)
           .font('Helvetica-Bold')
           .text('Morning Routine', 50, yPosition);
        
        yPosition += 20;
        
        routine.instructions.morning.forEach((instruction, index) => {
          if (yPosition < 700) {
            doc.fillColor(colors.dark)
               .fontSize(8)
               .font('Helvetica')
               .text(`• ${instruction}`, 60, yPosition, { width: 470 });
            yPosition += 12;
          }
        });
        yPosition += 15;
      }

      // Evening Instructions - Only if space allows
      if (routine.instructions.evening && yPosition < 650) {
        doc.fillColor(colors.primary)
           .fontSize(12)
           .font('Helvetica-Bold')
           .text('Evening Routine', 50, yPosition);
        
        yPosition += 20;
        
        routine.instructions.evening.forEach((instruction, index) => {
          if (yPosition < 700) {
            doc.fillColor(colors.dark)
               .fontSize(8)
               .font('Helvetica')
               .text(`• ${instruction}`, 60, yPosition, { width: 470 });
            yPosition += 12;
          }
        });
        yPosition += 15;
      }

      // Personalized Tips - Compact display
      if (routine.personalizedTips && routine.personalizedTips.length > 0 && yPosition < 650) {
        doc.fillColor(colors.primary)
           .fontSize(12)
           .font('Helvetica-Bold')
           .text('Expert Tips', 50, yPosition);
        
        yPosition += 20;
        
        // Two-column layout for tips to save space
        const tipsPerColumn = 5;
        const columnWidth = 240;
        let currentColumn = 0;
        
        routine.personalizedTips.slice(0, 10).forEach((tip, index) => {
          if (yPosition < 700) {
            const columnX = 50 + (currentColumn * columnWidth);
            const rowInColumn = index % tipsPerColumn;
            const tipY = yPosition + (rowInColumn * 20);
            
            // Move to next column if current is full
            if (rowInColumn === 0 && index > 0) {
              currentColumn++;
              if (currentColumn > 1) {
                // If no space for second column, stop
                return;
              }
            }
            
            doc.fillColor(colors.dark)
               .fontSize(7)
               .font('Helvetica')
               .text(`• ${tip}`, columnX, tipY, { width: columnWidth - 20 });
          }
        });
        
        yPosition += 120; // Approximate height for tips section
      }

      // Expected Results - Only if space available
      if (routine.expectedResults && routine.expectedResults.length > 0 && yPosition < 650) {
        yPosition += 10;
        doc.fillColor(colors.primary)
           .fontSize(12)
           .font('Helvetica-Bold')
           .text('Expected Results', 50, yPosition);
        
        yPosition += 20;
        
        routine.expectedResults.forEach((result, index) => {
          if (yPosition < 700) {
            doc.rect(50, yPosition, 500, 18)
               .fillColor(index % 2 === 0 ? '#FFFFFF' : colors.highlight)
               .strokeColor(colors.border)
               .fill()
               .stroke();

            doc.fillColor(colors.medium)
               .fontSize(8)
               .font('Helvetica')
               .text(`✓ ${result}`, 60, yPosition + 5, { width: 470 });

            yPosition += 23;
          }
        });
      }

      // Compact footer
      const finalY = Math.min(doc.page.height - 40, yPosition + 40);
      doc.rect(0, finalY - 10, doc.page.width, 50)
         .fillColor(colors.primary)
         .fill();
      
      doc.fillColor('#FFFFFF')
         .fontSize(9)
         .font('Helvetica-Bold')
         .text('DUBOIS BEAUTY - Luxury Skincare', 50, finalY, { align: 'center' });
      
      doc.fillColor(colors.highlight)
         .fontSize(7)
         .font('Helvetica')
         .text('Professional Results • Personalized Solutions', 50, finalY + 12, { align: 'center', width: doc.page.width - 100 });

      doc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};




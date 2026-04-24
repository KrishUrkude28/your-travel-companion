import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';

/**
 * Generates a WhatsApp sharing link for a trip itinerary
 */
export const generateWhatsAppLink = (trip: any, itinerary: any) => {
  const destination = trip.destination || 'my dream destination';
  const duration = trip.duration || 'a few days';
  
  let text = `*TravelSathi: My Itinerary for ${destination}* 🌍\n\n`;
  text += `📅 *Duration:* ${duration}\n`;
  
  if (itinerary.highlights && itinerary.highlights.length > 0) {
    text += `✨ *Highlights:* ${itinerary.highlights.slice(0, 3).join(', ')}\n`;
  }
  
  text += `\n📍 *Planned with TravelSathi* ✈️`;
  
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
};

/**
 * Exports a specific DOM element to PDF using html2canvas and jsPDF
 */
export const exportToPDF = async (elementOrId: string | HTMLElement, filename: string) => {
  const element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  if (!element) return;

  // Create a professional template wrapper off-screen
  const wrapper = document.createElement('div');
  wrapper.style.position = 'absolute';
  wrapper.style.left = '-9999px';
  wrapper.style.top = '0';
  wrapper.style.width = '800px';
  wrapper.style.backgroundColor = '#ffffff';
  wrapper.style.backgroundImage = 'radial-gradient(#e2e8f0 1px, transparent 1px)';
  wrapper.style.backgroundSize = '20px 20px';
  wrapper.style.color = '#000000';
  wrapper.style.fontFamily = 'Inter, sans-serif';
  wrapper.style.padding = '40px';
  wrapper.style.boxSizing = 'border-box';
  
  // Professional Header
  const header = document.createElement('div');
  header.innerHTML = `
    <div style="display: flex; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px;">
      <img src="/logo.png" alt="TravelSathi Logo" style="width: 48px; height: auto; margin-right: 15px;" />
      <div>
        <h1 style="margin: 0; font-size: 26px; font-weight: bold; color: #0f172a;">TravelSathi AI</h1>
        <p style="margin: 0; font-size: 14px; color: #64748b;">Your AI Travel Companion • Itinerary Document</p>
      </div>
    </div>
  `;
  wrapper.appendChild(header);

  // Content
  const content = document.createElement('div');
  content.innerHTML = element.innerHTML;
  
  // Remove action buttons and inputs from content
  const actionButtons = content.querySelectorAll('button, input, textarea, .itinerary-actions');
  actionButtons.forEach(btn => btn.remove());
  
  // Force clean styles for print
  const allElements = content.querySelectorAll('*');
  allElements.forEach((el: any) => {
    el.style.color = '#000000';
    // If it has a background, make it transparent or light
    if (el.tagName !== 'IMG') {
       el.style.backgroundColor = 'transparent';
    }
  });

  wrapper.appendChild(content);
  
  // Professional Footer
  const footer = document.createElement('div');
  footer.innerHTML = `
    <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #64748b; font-size: 12px; font-weight: 500;">
      Generated securely by TravelSathi AI • Plan your next adventure at travelsathi.com
    </div>
  `;
  wrapper.appendChild(footer);

  document.body.appendChild(wrapper);

  try {
    const canvas = await html2canvas(wrapper, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    
    document.body.removeChild(wrapper);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width / 2, canvas.height / 2]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
    
    // Return the blob for hosting if requested
    return pdf.output('blob');
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
};

/**
 * Uploads an itinerary PDF to Supabase Storage and returns the public URL
 */
export const uploadTripItinerary = async (blob: Blob, filename: string, userId: string) => {
  const path = `${userId}/${filename}-${Date.now()}.pdf`;
  
  const { error: uploadError } = await supabase.storage
    .from('itineraries')
    .upload(path, blob, {
      contentType: 'application/pdf',
      upsert: true
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('itineraries')
    .getPublicUrl(path);

  return data.publicUrl;
};

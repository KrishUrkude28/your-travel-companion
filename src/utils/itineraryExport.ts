import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
export const exportToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Add a print-mode class temporarily
  const originalStyle = element.getAttribute('style') || '';
  
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      backgroundColor: '#ffffff', // Force light background for print
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Force light colors for the cloned element
          clonedElement.style.color = '#000000';
          clonedElement.style.backgroundColor = '#ffffff';
          // Find all text elements and force black
          const textElements = clonedElement.querySelectorAll('h1, h2, h3, h4, p, span, li, div');
          textElements.forEach((el: any) => {
            el.style.color = '#000000';
          });
          // Hide elements that shouldn't be in PDF (like action buttons)
          const actionButtons = clonedElement.querySelector('.itinerary-actions');
          if (actionButtons) actionButtons.setAttribute('style', 'display: none !important');
        }
      }
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width / 2, canvas.height / 2]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
};

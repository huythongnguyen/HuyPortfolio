/**
 * Document Download Functionality
 * 
 * Provides download options for the current document:
 * - Markdown: Downloads the raw .md file
 * - PDF: Uses the browser's print dialog for PDF export
 */

import { currentDocument } from './config.js';

/**
 * Downloads the current document as a Markdown file.
 * Creates a blob and triggers a download with the document name.
 */
export function downloadAsMarkdown() {
    if (!currentDocument) return;

    const blob = new Blob([currentDocument.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDocument.name}.md`;
    a.click();
    
    URL.revokeObjectURL(url);
}

/**
 * Opens the browser print dialog for PDF export.
 * The print stylesheet hides navigation and formats content for printing.
 */
export function downloadAsPDF() {
    window.print();
}


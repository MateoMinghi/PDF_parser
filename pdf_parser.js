import * as pdfjsLib from './pdf.mjs';
    
pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';
document.getElementById('pdf-file').addEventListener('change', function(event) {
            const file = event.target.files[0];
    
            if (file && file.type === 'application/pdf') {
                const fileReader = new FileReader();
    
                fileReader.onload = function() {
                    const typedArray = new Uint8Array(this.result);
    
                    pdfjsLib.getDocument(typedArray).promise.then(pdf => {
                        //console.log('PDF loaded');
                        
                        let totalText = '';
                        const totalPages = pdf.numPages;
                        const pagePromises = [];

                        //loop to parse all pages
                        for (let i = 1; i <= totalPages; i++) {
                            pagePromises.push(
                                pdf.getPage(i).then(page => {
                                    return page.getTextContent().then(textContent => {
                                        return textContent.items.map(item => item.str).join(' ');
                                    });
                                })
                            );
                        }
    
                        Promise.all(pagePromises).then(pagesText => {
                            totalText = pagesText.join(' ');
                            console.log('Extracted text from all pages:', totalText); 
                            
                            
                            const relevantInfo = extractRelevantInfo(totalText);

                            
                            fillForm(relevantInfo);
                        });
                    })
                };
    
                fileReader.readAsArrayBuffer(file);
            } 
        });

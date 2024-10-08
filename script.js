document.addEventListener('DOMContentLoaded', () => {
    const pos = document.getElementById('pos');
    const banconote = document.getElementById('banconote');
    const fondoCassa = document.getElementById('fondoCassa');
    const ff = document.getElementById('ff');
    const rimborsi = document.getElementById('rimborsi');
    const altro = document.getElementById('altro');
    const pagoPa = document.getElementById('pagoPa');
    const farmaconsult = document.getElementById('farmaconsult');
    const scontrinoFiscale = document.getElementById('scontrinoFiscale');
    const scontrini = document.getElementById('scontrini');
    const risultato = document.getElementById('risultato');
    const resetButton = document.getElementById('resetButton');
    const saveButton = document.getElementById('saveButton');
    const sendButton = document.getElementById('sendButton');

    const inputs = [pos, banconote, fondoCassa, ff, rimborsi, altro];

    inputs.forEach(input => {
        input.addEventListener('input', calcolaRisultato);
    });
    pagoPa.addEventListener('input', calcolaRisultato);

    resetButton.addEventListener('click', resetCampi);
    saveButton.addEventListener('click', salvaSuExcel);
    sendButton.addEventListener('click', inviaDati);

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registrato con successo:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registrazione fallita:', error);
                });
        });
    }

    function calcolaRisultato() {
        let somma = 0;

        inputs.forEach(input => {
            let value = parseFloat(input.value);
            if (!isNaN(value)) {
                somma += value;
            }
        });

        let pagoPaValue = parseFloat(pagoPa.value);
        if (!isNaN(pagoPaValue)) {
            somma -= pagoPaValue;
        }

        risultato.textContent = somma;
    }

    function resetCampi() {
        inputs.concat(pagoPa, farmaconsult, scontrinoFiscale, scontrini).forEach(input => {
            input.value = 0;
        });
        calcolaRisultato();
    }

    function salvaSuExcel() {
        const data = [
            ['POS', pos.value],
            ['Banconote', banconote.value],
            ['Fondo Cassa', fondoCassa.value],
            ['FF', ff.value],
            ['Rimborsi', rimborsi.value],
            ['Altro', altro.value],
            ['Pago Pa', pagoPa.value],
            ['Farmaconsult', farmaconsult.value],
            ['Scontrino Fiscale', scontrinoFiscale.value],
            ['Scontrini', scontrini.value],
            ['Risultato', risultato.textContent],
            ['Data', new Date().toLocaleString()]
        ];

        let csvContent = "data:text/csv;charset=utf-8,";
        data.forEach(rowArray => {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "dati_calcolo.csv");
        document.body.appendChild(link);

        link.click();
    }

    function inviaDati() {
        const data = {
            pos: pos.value,
            banconote: banconote.value,
            fondoCassa: fondoCassa.value,
            ff: ff.value,
            rimborsi: rimborsi.value,
            altro: altro.value,
            pagoPa: pagoPa.value,
            farmaconsult: farmaconsult.value,
            scontrinoFiscale: scontrinoFiscale.value,
            scontrini: scontrini.value,
            risultato: risultato.textContent,
            data: new Date().toLocaleString()
        };

        fetch('https://script.google.com/macros/s/AKfycbydEn9BkvqE0UBiEIsjLo5CjEOvYD-ACmRLPvvZo6BSYY7cUUGGmkmh0rQKrVx48G9JkQ/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                alert('Dati inviati con successo');
            } else {
                alert('Errore durante l'invio dei dati');
            }
        }).catch(error => {
            console.error('Errore:', error);
            alert('Errore durante l'invio dei dati');
        });
    }
});

```javascript
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
    const risultato = document.getElementById('risultato');
    const resetButton = document.getElementById('resetButton');
    const saveButton = document.getElementById('saveButton');
    const addSaveButton = document.getElementById('addSaveButton');

    const inputs = [pos, banconote, fondoCassa, ff, rimborsi, altro, pagoPa];

    inputs.forEach(input => {
        input.addEventListener('input', calcolaRisultato);
    });

    resetButton.addEventListener('click', resetCampi);
    saveButton.addEventListener('click', salvaSuExcel);
    addSaveButton.addEventListener('click', aggiungiESalvaDati);

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
        let somma =
            parseFloat(pos.value) +
            parseFloat(banconote.value) +
            parseFloat(fondoCassa.value) +
            parseFloat(ff.value) +
            parseFloat(rimborsi.value) +
            parseFloat(altro.value);

        let pagoPaValue = parseFloat(pagoPa.value);
        if (!isNaN(pagoPaValue)) {
            somma -= pagoPaValue;
        }

        risultato.textContent = somma;
    }

    function resetCampi() {
        inputs.concat(farmaconsult, scontrinoFiscale).forEach(input => {
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

    function aggiungiESalvaDati() {
        const data = [
            pos.value,
            banconote.value,
            fondoCassa.value,
            ff.value,
            rimborsi.value,
            altro.value,
            pagoPa.value,
            farmaconsult.value,
            scontrinoFiscale.value,
            risultato.textContent,
            new Date().toLocaleString()
        ];

        let csvContent = "";
        let row = data.join(",");
        csvContent += row + "\r\n";

        const encodedUri = "data:text/csv;charset=utf-8," + csvContent;
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "dati_calcolo.csv");
        document.body.appendChild(link);

        link.click();
    }
});
```

const continent = document.getElementById('continent');
const modal = new bootstrap.Modal(document.getElementById('windowCountry'));
const modalBody = document.getElementById("modal-body-content");
const listCountries = document.getElementById('listCountries');

let currentData = [];

async function getData(region) {
    const url = `https://restcountries.com/v3.1/region/${region}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Chyba: ${response.status}`);
        const json = await response.json();
        currentData = json;
        renderCountries();
    } catch (error) {
        console.error(error.message);
        listCountries.innerHTML = `<p class="text-danger">Nepodařilo se načíst data.</p>`;
    }
}

function renderCountries() {
    let blocks = '';
    currentData.forEach((country) => {
        blocks += `
            <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">                
                <div class="card">
                    <img class="card-img-top" src="${country.flags.png}" alt="Vlajka ${country.name.common}">
                    <div class="card-body">
                        <h4 class="card-title">${country.name.common}</h4>
                        <p class="card-text"><strong>Hlavní město:</strong> ${country.capital?.[0] || 'N/A'}</p>
                        <p class="card-text"><strong>Populace:</strong> ${country.population.toLocaleString()}</p>
                        <p class="card-text"><strong>Rozloha:</strong> ${country.area?.toLocaleString() || 'N/A'} km²</p>
                        <a href="#" class="btn btn-info btn-sm card-link mt-2" data-name="${country.name.common}">Informace</a>
                    </div>
                </div>
            </div>
        `;
    });

    listCountries.innerHTML = blocks;

    document.querySelectorAll('[data-name]').forEach(button => {
        button.addEventListener('click', () => {
            const countryName = button.getAttribute('data-name');
            modal.show();
            fetch(`https://restcountries.com/v3.1/name/${countryName}`)
                .then(res => res.json())
                .then(data => {
                    const country = data[0];
                    modalBody.innerHTML = `
                        <h4>${country.name.official}</h4>
                        <p><strong>Hlavní město:</strong> ${country.capital?.[0] || 'N/A'}</p>
                        <p><strong>Rozloha:</strong> ${country.area?.toLocaleString()} km²</p>
                        <p><strong>Populace:</strong> ${country.population?.toLocaleString()}</p>
                        <p><strong>Jazyky:</strong> ${Object.values(country.languages || {}).join(', ')}</p>
                        <p><strong>Měna:</strong> ${Object.values(country.currencies || {}).map(c => `${c.name} (${c.symbol})`).join(', ')}</p>
                        <p><strong>Doména:</strong> ${country.tld?.join(', ')}</p>
                        <a href="${country.maps.googleMaps}" target="_blank" class="btn btn-sm btn-primary">Zobrazit na mapě</a>
                    `;
                })
                .catch(error => {
                    modalBody.innerHTML = `<p class="text-danger">Nepodařilo se načíst informace.</p>`;
                    console.error(error);
                });
        });
    });
}

continent.addEventListener('change', () => {
    getData(continent.value);
});

getData('europe');

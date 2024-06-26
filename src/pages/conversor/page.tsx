import { useRef, useState } from 'preact/hooks';
import type { priceAPIResponse } from '../../types';

import styles from './conversor.module.css';
import { getCurrency } from '../otherCurrencies/page';

const updateData = async () => {
	try {
		const eur = await getCurrency('eur');
		const brl = await getCurrency('brl');
		const clp = await getCurrency('clp');
		const uyu = await getCurrency('uyu');

		sessionStorage.setItem('dataOtherCurrencies', JSON.stringify([eur, brl, clp, uyu]));

		const response: Response = await fetch('https://dolarapi.com/v1/dolares');
		if (response.ok) {
			const data = await response.json();

			sessionStorage.setItem('data', JSON.stringify(data));
		} else {
			throw new Error(`HTTP Error: ${response.status}`);
		}
	} catch (error) {
		console.error(`Error during request: ${error}`);
	}
};

export function Conversor() {
	const [firstCurrency, setFirstCurrency] = useState('Oficial');
	const [secondCurrency, setSecondCurrency] = useState('Peso Argentino');
	const [output, setOutput] = useState(0);

	const valueToConvertRef = useRef<HTMLInputElement>(null);

	const { container, inputContainer, inputFlex, inputFieldBottom, form, outputContainer, invertCurrenciesButton } =
		styles;

	const convertCurrencies = async (event: SubmitEvent) => {
		event.preventDefault();

		const data = sessionStorage.getItem('data');
		const otherCurrenciesData = sessionStorage.getItem('dataOtherCurrencies');

		if (data && otherCurrenciesData) {
			const mergedData = JSON.parse(data).concat(JSON.parse(otherCurrenciesData)).concat({
				moneda: 'ARS',
				casa: 'Banco Central',
				nombre: 'Peso Argentino',
				venta: 1,
				compra: 1,
				fechaActualizacion: '',
			});

			const firstCurrencyData = mergedData.find((currency: priceAPIResponse) => currency.nombre === firstCurrency);
			const secondCurrencyData = mergedData.find((currency: priceAPIResponse) => currency.nombre === secondCurrency);

			if (firstCurrencyData && secondCurrencyData && valueToConvertRef.current) {
				const inputValue = parseFloat(valueToConvertRef.current.value);
				const conversionRate = (firstCurrencyData.venta / secondCurrencyData.venta) * inputValue;
				setOutput(Number(conversionRate.toFixed(2)));
			}
			return;
		}
		await updateData();
		convertCurrencies(event); // Recursion
	};

	const invertCurrencies = () => {
		setFirstCurrency(secondCurrency);
		setSecondCurrency(firstCurrency);
	};

	return (
		<main className={container}>
			<form onSubmit={convertCurrencies} className={form}>
				<div className={inputContainer}>
					<div>
						<label htmlFor="1st_currency">Primera divisa</label>
						<div className={inputFlex}>
							<input type="number" placeholder="0" id="1st_currency" ref={valueToConvertRef} min={1} required />
							<select
								name="1st_currency_options"
								id="1st_currency_options"
								onChange={(e) => {
									const event = e.target as HTMLSelectElement;
									setFirstCurrency(event.value);
								}}
								value={firstCurrency}
								className={inputFieldBottom}
							>
								<option value="Oficial" selected>
									Dólar Oficial
								</option>
								<option value="Blue">Dólar Blue</option>
								<option value="Contado con liquidación">Dólar Contado con Liquidación</option>
								<option value="Mayorista">Dólar Mayorista</option>
								<option value="Cripto">Dólar Cripto</option>
								<option value="Tarjeta">Dólar Tarjeta</option>
								<option value="Euro">Euro</option>
								<option value="Peso Argentino">Peso Argentino</option>
							</select>
						</div>
					</div>

					<button onClick={invertCurrencies} className={invertCurrenciesButton}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-arrow-right-left"
						>
							<path d="m16 3 4 4-4 4" />
							<path d="M20 7H4" />
							<path d="m8 21-4-4 4-4" />
							<path d="M4 17h16" />
						</svg>
						<span>Invertir</span>
					</button>

					<div>
						<label htmlFor="2nd_currency_options">Segunda divisa</label>

						<select
							name="2nd_currency_options"
							id="2nd_currency_options"
							onChange={(e) => {
								const event = e.target as HTMLSelectElement;
								setSecondCurrency(event.value);
							}}
							value={secondCurrency}
							className={inputFieldBottom}
						>
							<option value="Peso Argentino" selected>
								Peso Argentino
							</option>
							<option value="Oficial">Dólar Oficial</option>
							<option value="Blue">Dólar Blue</option>
							<option value="Contado con liquidación">Dólar Contado con Liquidación</option>
							<option value="Mayorista">Dólar Mayorista</option>
							<option value="Cripto">Dólar Cripto</option>
							<option value="Tarjeta">Dólar Tarjeta</option>
							<option value="Euro">Euro</option>
						</select>
					</div>
				</div>

				<button type="submit">Convertir</button>
			</form>

			<div className={outputContainer}>$ {output.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</div>
		</main>
	);
}

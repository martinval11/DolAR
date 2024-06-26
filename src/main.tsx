import { render } from 'preact';
import { Route, Switch } from 'wouter';

import { App } from './app.tsx';

import { OtherCurrencies } from './pages/otherCurrencies/page.tsx';
import { Conversor } from './pages/conversor/page.tsx';

import { Nav } from './components/nav/nav.tsx';
import { NotFound } from './components/notFound/notFound.tsx';

import '@picocss/pico/css/pico.min.css';
import './index.css';

import { registerSW } from 'virtual:pwa-register';

// add this to prompt for a refresh
const updateSW = registerSW({
	onNeedRefresh() {
		if (confirm('Nuevas actualizaciones disponibles. ¿Quieres actualizar ahora?')) {
			updateSW(true);
		}
	},
});

render(
	<>
		<Nav />
		<Switch>
			<Route path="/" component={App} />

			<Route path="/otrasDivisas" component={OtherCurrencies} />
			<Route path="/conversor" component={Conversor} />

			{/* Default route in a switch */}
			<Route>
				<NotFound />
			</Route>
		</Switch>
	</>,
	document.getElementById('app')!,
);

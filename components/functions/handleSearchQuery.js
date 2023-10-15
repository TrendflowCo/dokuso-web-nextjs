import { analytics } from "../../services/firebase";
import { logEvent } from "firebase/analytics";


export const handleSearchQuery = ( language , val , event , router ) => {
    logEvent(analytics, event, {
        search_term: val
    });
    router.push(`/${language}/results?query=${encodeURIComponent(val)}`); // no mantengo ningun filtro. Busco de nuevo a pagina 1 y sin filtros
};

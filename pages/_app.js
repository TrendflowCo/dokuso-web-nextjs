import '../styles/globals.css';
import Layout from '../components/global/LayOut';
import { store } from "../redux/store";
import { Provider } from "react-redux";
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  ) 
}

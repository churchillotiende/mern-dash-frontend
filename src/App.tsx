import { useEffect } from "react";
import "./styles/globals.css";
import "./styles/calendar.css";
import { Provider } from "react-redux";
import { MantineProvider, createTheme } from "@mantine/core";
import store from "./store/store";
import createEmotionCache from "./config/createEmotionCache";
import BaseLayout from "./components/layouts/base-layout";
import MerchantBaseLayout from "./components/layouts/merchant-base-layout";

// Assuming hotjar is globally available
// declare const hotjar: {
//   initialize: (a: number, b: number) => void;
// };

// const customCache = createEmotionCache({
//   key: "mantine",
//   prepend: false,
// });

function App() {
  useEffect(() => {
    // hotjar.initialize(3192307, 6);
  }, []);


  return (
    <Provider store={store}>
      <BaseLayout>

        <MerchantBaseLayout>
        </MerchantBaseLayout>

      </BaseLayout>

    </Provider >
  );
}

export default App;

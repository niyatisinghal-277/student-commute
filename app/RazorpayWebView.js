// app/RazorpayWebView.js
import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";

const RazorpayWebView = () => {
  const { ride: rideString } = useLocalSearchParams();
  const ride = JSON.parse(rideString || "{}");
  const router = useRouter();

  const htmlContent = `
    <html>
      <head><script src="https://checkout.razorpay.com/v1/checkout.js"></script></head>
      <body>
        <script>
          var options = {
            "key": "rzp_test_m2y9JHluuU4UrH",
            "amount": "${ride.pricePerPassenger * 100}",
            "currency": "INR",
            "name": "Carpool App",
            "description": "Ride Payment",
            "handler": function (response) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                status: "initiated",
                payment_id: response.razorpay_payment_id
              }));
            },
            "prefill": {
              "name": "Passenger",
              "email": "${ride.passengerEmail || ""}"
            },
            "theme": { "color": "#3399cc" }
          };
          var rzp = new Razorpay(options);
          rzp.open();
        </script>
      </body>
    </html>
  `;

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.status === "initiated") {
      router.replace({
  pathname: "/PaymentInitiated",
        params: {
          ride: JSON.stringify(ride),
          paymentId: data.payment_id
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        onMessage={handleWebViewMessage}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator size="large" color="#4CAF50" style={{ flex: 1 }} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({ container: { flex: 1 } });
export default RazorpayWebView;
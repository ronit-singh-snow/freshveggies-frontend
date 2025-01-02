import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';

const TermsAndConditions = () => {
    const [showTerms, setShowTerms] = useState(true);

    const toggleTerms = () => {
        setShowTerms(!showTerms);
    };

    return (
        <View style={styles.container}>

            {showTerms && (
                <ScrollView style={styles.termsContainer}>
                    <View >
                        {/* Replace with your actual terms and conditions */}
                        <Text style={styles.termHeading}>1. Introduction</Text>
                        <Text style={styles.termsText}>
                            These Terms and Conditions govern your use of the V-Gram Cart online platform for the purchase of fruits, vegetables and cereal grains like Rice, pulses, Flour etc. and Pickles. By accessing or using the Platform, you agree to be bound by these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use the Platform.
                        </Text>

                        <Text style={styles.termHeading}>2. Account Registration</Text>
                        <View >
                            <Text style={styles.termsText}>* You may be required to create an account on the Platform to make purchases.</Text>
                            <Text style={styles.termsText}>* You are responsible for maintaining the confidentiality of your account information and for restricting access to your computer.</Text>
                            <Text style={styles.termsText}>* You agree to be responsible for all activities that occur under your account.</Text>
                        </View>

                        <Text style={styles.termHeading}>3. Product Information</Text>
                        <View >
                            <Text style={styles.termsText}>* We strive to provide accurate and up-to-date information about our Products on the Platform. However, we do not guarantee the accuracy, completeness, or reliability of any such information.</Text>
                            <Text style={styles.termsText}>* Product images are for illustrative purposes only and may not accurately reflect the actual appearance of the Products.</Text>
                            <Text style={styles.termsText}>* We reserve the right to modify or discontinue any Product at any time without prior notice.</Text>
                        </View>

                        <Text style={styles.termHeading}>4. Ordering and Payment</Text>
                        <View >
                            <Text style={styles.termsText}>* You can place orders for Products through the Platform.</Text>
                            <Text style={styles.termsText}>* All orders are subject to availability.</Text>
                            <Text style={styles.termsText}>* We reserve the right to refuse or cancel any order for any reason.</Text>
                            <Text style={styles.termsText}>* Payment for orders can be made through the payment methods specified on the Platform.</Text>
                            <Text style={styles.termsText}>* You are responsible for ensuring that the payment information you provide is accurate and complete.</Text>
                        </View>

                        <Text style={styles.termHeading}>5. Delivery</Text>
                        <View >
                            <Text style={styles.termsText}>* We will use our best efforts to deliver your order within the estimated delivery time.</Text>
                            <Text style={styles.termsText}>* Delivery times may vary depending on your location and other factors.</Text>
                            <Text style={styles.termsText}>* We are not responsible for any delays in delivery caused by factors beyond our control, such as inclement weather or traffic congestion.</Text>
                            <Text style={styles.termsText}>* You are responsible for inspecting the Products upon delivery and notifying us of any damages or discrepancies immediately when delivery partner hands over the product.</Text>
                        </View>

                        <Text style={styles.termHeading}>6. Returns and Refunds</Text>
                        <View >
                            <Text style={styles.termsText}>* We may offer returns and refunds for certain Products under specific circumstances, such as if the Products are damaged or defective upon delivery.</Text>
                        </View>

                        <Text style={styles.termHeading}>7. Intellectual Property</Text>
                        <View >
                            <Text style={styles.termsText}>* All content on the Platform, including but not limited to text, images, logos, and trademarks, is protected by intellectual property laws.</Text>
                            <Text style={styles.termsText}>* You may not use any content from the Platform without our prior written consent. </Text>
                        </View>

                        <Text style={styles.termHeading}>8. Disclaimer of Warranties</Text>
                        <View >
                            <Text style={styles.termsText}>* THE PLATFORM AND THE PRODUCTS ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</Text>
                            <Text style={styles.termsText}>* WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE PLATFORM OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</Text>
                        </View>

                        <Text style={styles.termHeading}>9. Limitation of Liability</Text>
                        <View >
                            <Text style={styles.termsText}>* IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA LOSS, OR LOSS OF GOODWILL, ARISING OUT OF OR IN CONNECTION WITH THE USE OF THE PLATFORM OR THE PRODUCTS, WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. </Text>
                        </View>

                        <Text style={styles.termHeading}>9. Indemnification</Text>
                        <View >
                            <Text style={styles.termsText}>* You agree to indemnify and hold us harmless from and against any and all claims, liabilities, damages, losses, costs, and expenses, including attorneys' fees, arising out of or in any way connected with your use of the Platform or your violation of these Terms and Conditions.</Text>
                        </View>

                        <Text style={styles.termHeading}>10. Governing Law</Text>
                        <View >
                            <Text style={styles.termsText}>* These Terms and Conditions shall be governed by and construed in accordance with the laws of your Jurisdiction</Text>
                        </View>

                        <Text style={styles.termHeading}>11. Changes to Terms and Conditions</Text>
                        <View >
                            <Text style={styles.termsText}>* We reserve the right to modify these Terms and Conditions at any time without prior notice.</Text>
                        </View>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    termsContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    termsText: {
        fontSize: 14,
        paddingLeft: 15,
        paddingBottom: 5
    },
    termHeading: {
        fontSize: 20,
        marginVertical: 10
    }
});

export default TermsAndConditions;
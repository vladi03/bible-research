import axios from 'axios';
import functions from 'firebase-functions';

// Get MailerLite configuration
const getMailerLiteConfig = () => {
    if (process.env.NODE_ENV === 'development') {
        return {
            apiKey: process.env.MAILERLITE_API_KEY,
            fromEmail: process.env.FROM_EMAIL || 'noreply@cocktailbuddy.com',
            fromName: process.env.FROM_NAME || 'Cocktail Buddy'
        };
    } else {
        const config = functions.config();
        return {
            apiKey: config.mailerlite?.api_key,
            fromEmail: config.email?.from_email || 'noreply@cocktailbuddy.com',
            fromName: config.email?.from_name || 'Cocktail Buddy'
        };
    }
};

export const onCreateOutgoingEmail = async (snapshot, context) => {
    const emailData = snapshot.data();
    const { params } = context;
    
    console.log(`Processing email for: ${emailData.email}`);
    
    try {
        // Generate HTML content based on template type
        const htmlContent = generateEmailContent(emailData.templateType, emailData.templateData);
        
        // Send email using MailerLite
        await sendMailerLiteEmail({
            to: emailData.email,
            subject: emailData.subject,
            html: htmlContent
        });

        console.log('Email sent successfully via MailerLite');
        
        // Update the document with success status
        await snapshot.ref.update({
            status: 'sent',
            sentAt: new Date()
        });

    } catch (error) {
        console.error('Failed to send email:', error);
        
        // Update the document with error status
        await snapshot.ref.update({
            status: 'failed',
            error: error.message,
            failedAt: new Date()
        });
    }
};

// Test function for manual email sending
export const testOutgoingEmail = async (emailData) => {
    try {
        const htmlContent = generateEmailContent(emailData.templateType, emailData.templateData);
        
        await sendMailerLiteEmail({
            to: emailData.email,
            subject: emailData.subject,
            html: htmlContent
        });

        return { success: true };
    } catch (error) {
        console.error('Test email failed:', error);
        throw error;
    }
};

// Send email using MailerLite API
const sendMailerLiteEmail = async ({ to, subject, html }) => {
    const config = getMailerLiteConfig();
    
    if (!config.apiKey) {
        throw new Error('MailerLite API key not configured');
    }

    try {
        const response = await axios.post(
            'https://connect.mailerlite.com/api/emails',
            {
                from: {
                    email: config.fromEmail,
                    name: config.fromName
                },
                to: [{
                    email: to
                }],
                subject: subject,
                html: html
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('MailerLite API error:', error.response?.data || error.message);
        throw new Error(`MailerLite send failed: ${error.response?.data?.message || error.message}`);
    }
};

// Generate HTML content for different email types (no external templates)
const generateEmailContent = (templateType, data) => {
    switch (templateType) {
        case 'cocktailRecommendation':
            return generateCocktailRecommendationEmail(data);
        case 'welcome':
            return generateWelcomeEmail(data);
        case 'dailyCocktail':
            return generateDailyCocktailEmail(data);
        default:
            return generateGenericEmail(data);
    }
};

const generateCocktailRecommendationEmail = (data) => {
    const { cocktails = [], preferences = {}, userName = 'Friend' } = data;
    
    const cocktailsHtml = cocktails.map(cocktail => `
        <div style="border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 20px; background-color: #fdfdfe;">
            <h3 style="color: #2d3436; margin-bottom: 10px;">${cocktail.name}</h3>
            <p style="color: #6c5ce7; margin-bottom: 10px;">${cocktail.category || 'Classic'} • ${cocktail.glass || 'Cocktail Glass'}</p>
            
            ${cocktail.description ? `<p style="font-style: italic; margin-bottom: 15px;">${cocktail.description}</p>` : ''}
            
            <div style="margin: 15px 0;">
                <h4>Ingredients:</h4>
                ${cocktail.ingredients ? cocktail.ingredients.map(ingredient => `
                    <div style="padding: 5px 0; border-bottom: 1px dotted #ddd;">
                        <strong>${ingredient.name}</strong>${ingredient.amount ? ` - ${ingredient.amount}` : ''}
                    </div>
                `).join('') : ''}
            </div>
            
            ${cocktail.instructions ? `
                <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #6c5ce7; margin-top: 15px;">
                    <h4>Instructions:</h4>
                    <p>${cocktail.instructions}</p>
                </div>
            ` : ''}
        </div>
    `).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Cocktail Recommendations</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #6c5ce7; font-size: 32px;">🍸 Cocktail Buddy</h1>
                <h2>Your Personalized Cocktail Recommendations</h2>
                <p>Hello ${userName}! Here are some cocktails we think you'll love.</p>
            </div>

            ${preferences.favoriteSpirits || preferences.tasteProfile ? `
                <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Based on your preferences:</h3>
                    <ul>
                        ${preferences.favoriteSpirits ? `<li><strong>Favorite Spirits:</strong> ${preferences.favoriteSpirits.join(', ')}</li>` : ''}
                        ${preferences.tasteProfile ? `<li><strong>Taste Profile:</strong> ${preferences.tasteProfile}</li>` : ''}
                    </ul>
                </div>
            ` : ''}

            ${cocktailsHtml}

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #636e72; font-size: 14px;">
                <p>Cheers! 🥂</p>
                <p>Happy mixing from your friends at Cocktail Buddy</p>
            </div>
        </body>
        </html>
    `;
};

const generateWelcomeEmail = (data) => {
    const { userName = 'Cocktail Enthusiast' } = data;
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Cocktail Buddy!</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #6c5ce7; font-size: 32px;">🍸 Welcome to Cocktail Buddy!</h1>
                <p style="font-size: 18px;">Hello ${userName}!</p>
            </div>

            <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 20px 0;">
                <h3>Get ready to discover amazing cocktails!</h3>
                <p>We're excited to have you join our community of cocktail enthusiasts. Here's what you can expect:</p>
                <ul>
                    <li>🍹 Personalized cocktail recommendations based on your taste preferences</li>
                    <li>📱 Daily featured cocktails to inspire your next drink</li>
                    <li>📚 Complete ingredient guides and mixing instructions</li>
                    <li>⭐ Rate and save your favorite cocktails</li>
                </ul>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 16px;">Ready to start mixing? Let's find your perfect cocktail!</p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #636e72; font-size: 14px;">
                <p>Cheers to great cocktails! 🥂</p>
                <p>The Cocktail Buddy Team</p>
            </div>
        </body>
        </html>
    `;
};

const generateDailyCocktailEmail = (data) => {
    const { cocktail = {}, userName = 'Friend' } = data;
    
    return `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #6c5ce7;">🌟 Today's Featured Cocktail</h1>
                <p>Hello ${userName}! Here's today's special cocktail just for you.</p>
            </div>

            <div style="border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; background-color: #fdfdfe;">
                <h2 style="color: #2d3436;">${cocktail.name || 'Special Cocktail'}</h2>
                <p style="color: #6c5ce7; font-weight: 500;">${cocktail.category || 'Featured'}</p>
                ${cocktail.description ? `<p style="font-style: italic;">${cocktail.description}</p>` : ''}
                
                <p style="margin-top: 20px;">Perfect for today's mood! Give it a try and let us know what you think.</p>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #636e72; font-size: 14px;">
                <p>Cheers! 🥂</p>
            </div>
        </body>
        </html>
    `;
};

const generateGenericEmail = (data) => {
    const { message = 'Thank you for using Cocktail Buddy!', userName = 'Friend' } = data;
    
    return `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center;">
                <h1 style="color: #6c5ce7;">🍸 Cocktail Buddy</h1>
                <p>Hello ${userName}!</p>
                <p>${message}</p>
            </div>
        </body>
        </html>
    `;
}; 
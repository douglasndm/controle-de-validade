import React, { useState, useCallback, useContext } from 'react';
import { View, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { translate } from '../../../../Locales';

import PreferencesContext from '../../../../Contexts/PreferencesContext';

import { isSubscriptionActive } from '../../../../Functions/ProMode';
import {
    ImportBackupFile,
    ExportBackupFile,
} from '../../../../Functions/Backup';
import { exportToExcel } from '../../../../Functions/Excel';

import Button from '../../../../Components/Button';
import Notification from '../../../../Components/Notification';

import {
    Category,
    CategoryTitle,
    CategoryOptions,
    SettingDescription,
} from '../../styles';

import {
    Container,
    PremiumButtonsContainer,
    ButtonPremium,
    ButtonPremiumText,
    ButtonCancel,
    ButtonCancelText,
    Loading,
} from './styles';

const Pro: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

    const [isImportLoading, setIsImportLoading] = useState<boolean>(false);
    const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
    const [isExcelLoading, setIsExcelLoading] = useState<boolean>(false);
    const [error, setError] = useState('');

    const { navigate, reset } = useNavigation();

    const handleCancel = useCallback(async () => {
        await Linking.openURL(
            'https://play.google.com/store/account/subscriptions?sku=controledevalidade_premium&package=com.controledevalidade'
        );

        if (!(await isSubscriptionActive())) {
            reset({
                routes: [{ name: 'Home' }],
            });
        }
    }, [reset]);

    const navigateToPremiumView = useCallback(() => {
        navigate('PremiumSubscription');
    }, [navigate]);

    const handleImportBackup = useCallback(async () => {
        try {
            setIsImportLoading(true);

            await ImportBackupFile();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsImportLoading(false);
        }
    }, []);

    const handleExportBackup = useCallback(async () => {
        try {
            setIsExportLoading(true);
            await ExportBackupFile();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsExportLoading(false);
        }
    }, []);

    const handleExportToExcel = useCallback(async () => {
        try {
            setIsExcelLoading(true);
            await exportToExcel();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsExcelLoading(false);
        }
    }, []);

    const onDimissError = useCallback(() => {
        setError('');
    }, []);

    return (
        <>
            <Container>
                <Category>
                    <CategoryTitle>
                        {translate('View_Settings_CategoryName_Pro')}
                    </CategoryTitle>

                    {!userPreferences.isUserPremium && (
                        <Button
                            text={translate(
                                'View_Settings_Button_BecobeProToUnlockNewFeatures'
                            )}
                            onPress={navigateToPremiumView}
                        />
                    )}

                    <CategoryOptions
                        notPremium={!userPreferences.isUserPremium}
                    >
                        <View>
                            <SettingDescription>
                                {translate(
                                    'View_Settings_SettingName_ExportAndInmport'
                                )}
                            </SettingDescription>

                            <PremiumButtonsContainer>
                                <ButtonPremium
                                    enabled={
                                        userPreferences.isUserPremium &&
                                        !isImportLoading
                                    }
                                    onPress={handleImportBackup}
                                >
                                    {isImportLoading ? (
                                        <Loading />
                                    ) : (
                                        <ButtonPremiumText>
                                            {translate(
                                                'View_Settings_Button_ImportFile'
                                            )}
                                        </ButtonPremiumText>
                                    )}
                                </ButtonPremium>
                                <ButtonPremium
                                    enabled={
                                        userPreferences.isUserPremium &&
                                        !isExportLoading
                                    }
                                    onPress={handleExportBackup}
                                >
                                    {isExportLoading ? (
                                        <Loading />
                                    ) : (
                                        <ButtonPremiumText>
                                            {translate(
                                                'View_Settings_Button_ExportFile'
                                            )}
                                        </ButtonPremiumText>
                                    )}
                                </ButtonPremium>

                                <ButtonPremium
                                    enabled={
                                        userPreferences.isUserPremium &&
                                        !isExcelLoading
                                    }
                                    onPress={handleExportToExcel}
                                >
                                    {isExcelLoading ? (
                                        <Loading />
                                    ) : (
                                        <ButtonPremiumText>
                                            {translate(
                                                'View_Settings_Button_ExportToExcel'
                                            )}
                                        </ButtonPremiumText>
                                    )}
                                </ButtonPremium>
                            </PremiumButtonsContainer>
                        </View>
                    </CategoryOptions>

                    {userPreferences.isUserPremium && (
                        <ButtonCancel onPress={handleCancel}>
                            <ButtonCancelText>
                                {translate(
                                    'View_Settings_Button_CancelSubscribe'
                                )}
                            </ButtonCancelText>
                        </ButtonCancel>
                    )}
                </Category>
            </Container>
            {!!error && (
                <Notification
                    NotificationType="error"
                    NotificationMessage={error}
                    onPress={onDimissError}
                />
            )}
        </>
    );
};

export default Pro;

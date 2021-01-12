import React, { useState, useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import RNFS, { unlink, copyFile } from 'react-native-fs';
import { RNCamera } from 'react-native-camera';

import { translate } from '../../Locales';

import BackButton from '../BackButton';
import Button from '../Button';
import Notification from '../Notification';

import {
    Container,
    PageHeader,
    PageTitle,
    CameraContainer,
    CameraComponent,
    ButtonsContainer,
} from './styles';

interface CameraProps {
    onPhotoTaked: (photoPath: string) => void;
    onBackButtonPressed?: () => void;
}

const Camera: React.FC<CameraProps> = ({
    onPhotoTaked,
    onBackButtonPressed,
}: CameraProps) => {
    const { goBack } = useNavigation();

    const cameraRef = useRef(null);
    const [error, setError] = useState('');

    const [image, setImage] = useState<string | null>(null);
    const [photoTaked, setPhotoTalked] = useState<boolean>(false);
    const [takingPhoto, setIsTakingPhoto] = useState<boolean>(false);

    const handleCapturePicture = useCallback(async () => {
        try {
            if (cameraRef && cameraRef.current) {
                const options = {
                    quality: 0.5,
                    base64: true,
                    pauseAfterCapture: true,
                    orientation: RNCamera.Constants.Orientation.portrait,
                };
                const data = await cameraRef.current.takePictureAsync(options);

                setImage(data.uri);
                setPhotoTalked(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsTakingPhoto(false);
        }
    }, []);

    const handleTakeAnotherPhoto = useCallback(async () => {
        try {
            if (image) {
                await unlink(image);
            }

            setImage(null);
            setPhotoTalked(false);

            if (cameraRef && cameraRef.current) {
                await cameraRef.current.resumePreview();
            }
        } catch (err) {
            setError(err.message);
        }
    }, [image]);

    const handleSavePhoto = useCallback(async () => {
        if (image) {
            const splited = image.split('/');
            const generatedFilneName = splited[splited.length - 1];

            const newDir = `${
                RNFS.DocumentDirectoryPath
            }/${Date.now()}-${generatedFilneName}`;

            await copyFile(image, newDir);

            await unlink(image);

            onPhotoTaked(newDir);
        }
    }, [image, onPhotoTaked]);

    return (
        <Container>
            <PageHeader>
                <BackButton handleOnPress={onBackButtonPressed || goBack} />
                <PageTitle>
                    {!image
                        ? translate('Component_Camera_PageTitle')
                        : translate('Component_Camera_PageTitle_OnPreview')}
                </PageTitle>
            </PageHeader>

            <CameraContainer>
                <CameraComponent ref={cameraRef} />
            </CameraContainer>

            <ButtonsContainer>
                {!photoTaked ? (
                    <Button
                        text={translate('Component_Camera_Button_TakePicture')}
                        onPress={handleCapturePicture}
                        isLoading={takingPhoto}
                    />
                ) : (
                    <>
                        <Button
                            text={translate(
                                'Component_Camera_Button_TakeAnotherPicture'
                            )}
                            onPress={handleTakeAnotherPhoto}
                            contentStyle={{ marginRight: 10 }}
                        />
                        <Button
                            text={translate(
                                'Component_Camera_Button_SavePicture'
                            )}
                            onPress={handleSavePhoto}
                        />
                    </>
                )}
            </ButtonsContainer>

            {!!error && (
                <Notification
                    NotificationType="error"
                    NotificationMessage={error}
                    onPress={() => setError('')}
                />
            )}
        </Container>
    );
};

export default Camera;
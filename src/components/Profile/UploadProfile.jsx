import React, { useState, useContext } from 'react'
import axios from 'axios'
import { Button, Typography } from '@mui/material'
import { UserContext } from '../../context/User'
import { toast } from 'react-toastify'

const UploadProfile = () => {
    const { user, setUser } = useContext(UserContext)
    const [profileImg, setProfileImg] = useState('')

    const handleImageChange = async (event) => {
        const selectedFile = event.target.files[0]

        if (selectedFile && selectedFile.size < 3145728) {
            const imageUrl = URL.createObjectURL(selectedFile)
            setProfileImg(imageUrl)

            setUser((prevUser) => ({
                ...prevUser,
                profileImage: imageUrl
            }))

            // Create a new FormData object
            const formData = new FormData();

            // Append the image file to the FormData object
            formData.append('image', event.target.files[0]);

            // Append other data to the FormData object
            formData.append('user_type', user.role ? 'teacher' : 'student');
            formData.append('_id', user._id);

            // Send the FormData object to the server using Axios
            await axios.post('/upload_user_image', formData).then((response) => {
                toast.success("Updated profile picture");
            }).catch((error) => {
                // Handle errors
                console.error('Error uploading image:', error);
            });


        } else {
            console.error('Selected file is too large or no file selected.')
        }
    }


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
            <div>
                <Typography variant="caption" sx={{ textAlign: 'center', margin: '0' }}>
                    Update Your Profile Image
                </Typography>

                <input
                    accept="image/*"
                    id="contained-button-file"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                />
                <label htmlFor="contained-button-file">
                    <Button
                        className="primary-button"
                        component="span"
                        style={{
                            fontSize: '14px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: '#eeeeee'
                            },
                            margin: '0',
                            display: 'flex',
                            justifyContent: 'center',
                            backgroundColor: '#3f51b5'
                        }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontFamily: 'Outfit',
                                fontSize: '14px',
                                fontWeight: 400,
                                lineHeight: '24px',
                                letterSpacing: '0em',
                                textAlign: 'center',
                                color: 'white',
                                margin: '0'
                            }}
                        >
                            Choose Picture
                        </Typography>
                    </Button>
                </label>
            </div>
        </div>
    )
}

export default UploadProfile

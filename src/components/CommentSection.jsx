import React, { useState, useContext } from 'react'
import { Box, TextField, Button, Divider, List, ListItem, Avatar, Typography } from '@mui/material'
import { UserContext } from '../context/User'
import { useNavigate } from 'react-router'
import axios from 'axios'

const CommentsSection = ({ pdf_id }) => {

    const { user } = useContext(UserContext)

    const [comments, setComments] = useState('')
    const Navigate = useNavigate()

    const handleCommentChange = (e) => {
        setComments(e.target.value)
    }

    const handleSubmit = () => {
        let data = {
            text: comments,
            teacher_id: user._id,
            pdf_id: pdf_id
        };

        axios.post('http://localhost:5000/add_comment', data)
            .then((response) => {
                console.log(response.data);
            })

        setComments('');

    }

    return (
        <Box borderRadius={4} margin={2} sx={{ height: "auto" }}>
            <Typography sx={{ marginBottom: '10px' }}>Comments</Typography>
            <TextField
                multiline
                rows={20}
                placeholder="Add a comment..."
                variant="outlined"
                fullWidth
                value={comments}
                onChange={handleCommentChange}
            />

            <Divider />

            {user.role === 'Supervisor' || user.role=='CoordinateCommitte' || user.role=='DAC'? (
                <>
                    <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '10px' }}>
                        Post
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => Navigate('/view-comments')}
                        style={{ marginTop: '10px', marginLeft: '10px' }}
                    >
                        View Comments
                    </Button>
                </>
            ) : null}
        </Box>
    )
}

export default CommentsSection

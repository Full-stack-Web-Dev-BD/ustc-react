import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';


export default function HelpCard({ title, subTitle, desc }) {
    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined" style={{height:'250px'}}>
                <CardContent>
                    <h3 style={{fontSize:'30px'}} >{title} </h3>
                    <div className='mt-5'>
                        <h4>{subTitle}</h4>
                        <p>{desc}</p>
                    </div>
                </CardContent> 
            </Card>
        </Box>
    );
}

import { Paper, Divider, Box, Button, IconButton, Typography, useTheme,FormControl, FormLabel,TextField,Grid,Container  } from "@mui/material";
import { tokens } from "../../../theme";
import { styled } from '@mui/material/styles';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../../components/Header";
import { Person2 } from "@mui/icons-material";
import { m } from "framer-motion";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const LastOpVisit = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    return (
      <Box m="10px">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Out Patient Visit" subtitle="New OP Visit" />
  
          <Box>
            <Button
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              <Person2 sx={{ mr: "10px" }} />
              New OP Visit
            </Button>
          </Box>
        </Box>
  
     
          {/* ROW 2 */}
          <Box
            gridColumn="span 8"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
          >
          
<FormControl fullWidth >

      <Grid x={12}  container >
        <Grid xs={3}  item sx={{ p:3}}>
        <item >
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} fullWidth size='small' color="secondary" id="outlined-basic" label="UID" variant="outlined" />
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" }  }} required select fullWidth size='small' color="secondary" id="outlined-basic" label="Gender" variant="outlined" />
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" }  }} select required fullWidth size='small' color="secondary" id="outlined-basic" label="State" variant="outlined" />
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" }  }} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} fullWidth size='small' color="secondary" id="outlined-basic" label="Pin code" variant="outlined" />
        
        </item>
        </Grid>
        <Grid xs={3}  item  sx={{ p:3 }}> 
        <item> 
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}  fullWidth size='small' color="secondary" id="outlined-basic" label="Phone Number" variant="outlined" />
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} required inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} fullWidth size='small' color="secondary" id="outlined-basic" label="Age" variant="outlined" />
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} select required fullWidth size='small' color="secondary" id="outlined-basic" label="District " variant="outlined" />
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} select required fullWidth size='small' color="secondary" id="outlined-basic" label="Category" variant="outlined" />
        </item>
        </Grid>
        <Grid xs={3}  item  sx={{ p:3 }}> 
        <item> 
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} required fullWidth size='small' color="secondary" id="outlined-basic" label="First Name" variant="outlined" />
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} select fullWidth size='small' color="secondary" id="outlined-basic" label=" Relationship" variant="outlined" />
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} select required fullWidth size='small' color="secondary" id="outlined-basic" label="Village/Town/City" variant="outlined" />
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} select fullWidth size='small' color="secondary" id="outlined-basic" label="Scheme " variant="outlined" />
        </item>
        </Grid>
        <Grid xs={3}  item  sx={{ p:3 }}> 
        <item> 
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} required fullWidth size='small' color="secondary" id="outlined-basic" label="Last Name" variant="outlined" />
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} fullWidth size='small' color="secondary" id="outlined-basic" label="Relative's Name" variant="outlined" />
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} fullWidth size='small' color="secondary" id="outlined-basic" label="Address" variant="outlined" />
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} fullWidth size='small' color="secondary" id="outlined-basic" label="Outlined" variant="outlined" />
        </item>
        </Grid>
        </Grid>
       
 
        

          <Divider variant="middle" />
               {/* ROW 3 */}
       

      <Grid x={12}  container >
        <Grid xs={3}  item sx={{ p:3 }}>
        <item >
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} required select fullWidth size='small' color="secondary" id="outlined-basic" label="Visit Reason" variant="outlined" />
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} fullWidth size='small' color="secondary" id="outlined-basic" label="Referred By" variant="outlined" />
        
        
        </item>
        </Grid>
        <Grid xs={3}  item  sx={{ p:3 }}> 
        <item> 
        
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} select required fullWidth size='small' color="secondary" id="outlined-basic" label="Speciality" variant="outlined" />
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} select fullWidth size='small' color="secondary" id="outlined-basic" label="Id Proof" variant="outlined" />
        
        </item>
        </Grid>
        <Grid xs={3}  item  sx={{ p:3 }}> 
        <item> 

        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} select required fullWidth size='small' color="secondary" id="outlined-basic" label="Doctor" variant="outlined" />
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} fullWidth size='small' color="secondary" id="outlined-basic" label="Reference Card No." variant="outlined" />
        
        </item>
        </Grid>
        <Grid xs={3}  item  sx={{ p:3 }}> 
        <item> 
        <TextField sx={{ m:1,fieldset: { borderColor: "secondary.main" } }} select required fullWidth size='small' color="secondary" id="outlined-basic" label="Referral Type" variant="outlined" />
        </item>
        </Grid>
        </Grid>
       
        <Divider variant="middle" />
               {/* ROW 4 */}
              
        <Box sx={{ flexGrow: 1 ,pb:'50px'}}>
      <Grid container spacing={3} sx={{ p:3 }}>
        <Grid item xs={6}>
          <Item sx={{fontSize:'16',fontWeight:'600'}}>Registration Fees</Item>
          
        </Grid>
        <Grid item xs={2}>
          <Item>5.00 Rs</Item>
          
        </Grid>
        <Grid item xs>
          <FormControlLabel control={<Checkbox defaultChecked />} label="Waive Off" />
          <Button sx={{width:'100px',m:'12px'}}variant="contained" color="secondary">Save</Button>
          <Button sx={{width:'100px',m:'12px'}}variant="outlined" startIcon={<DeleteIcon />}>Clear</Button>
        </Grid>
      </Grid>
    </Box>
    
    
</FormControl>
           
          </Box>
        </Box>
     
    );
  };
  
  export default LastOpVisit;
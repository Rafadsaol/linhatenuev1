import {defineConfig} from 'vite';
import {campaignSyncPlugin} from './scripts/campaign-server.js';
export default defineConfig(({mode})=>({define:{'import.meta.env.VITE_STATIC_DEMO':JSON.stringify(mode==='portfolio'?'true':'false')},plugins:[campaignSyncPlugin()],server:{port:3000,strictPort:true,watch:{ignored:['**/.linha-tenue/**']}},preview:{strictPort:true}}));

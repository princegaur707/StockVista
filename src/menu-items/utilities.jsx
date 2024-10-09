// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Utilities',
  type: 'group',
  children: [
    //Side navigation bar items list
    // {
    //   id: 'util-typography',
    //   title: 'Market Depth',
    //   type: 'item',
    //   url: '/typography',
    //   // icon: icons.FontSizeOutlined
    // },
    // {
    //   id: 'util-color',
    //   title: 'Sectorial Flow',
    //   type: 'item',
    //   url: '/color',
    //   // icon: icons.BgColorsOutlined
    // },
    // {
    //   id: 'util-shadow',
    //   title: 'Swing Center',
    //   type: 'item',
    //   url: '/shadow',
    //   // icon: icons.BarcodeOutlined
    // },
    // {
    //   id: 'util-shadow',
    //   title: 'Index Analysis',
    //   type: 'item',
    //   url: '/shadow',
    //   // icon: icons.BarcodeOutlined
    // }
    // ,
    // {
    //   id: 'util-shadow',
    //   title: 'Money Flux',
    //   type: 'item',
    //   url: '/shadow',
    //   // icon: icons.BarcodeOutlined
    // }
    {
      id: 'until-shadow',
      title: 'Intraday Recommendations',
      type: 'item',
      url: '/shadow'
    }
  ]
};

export default utilities;

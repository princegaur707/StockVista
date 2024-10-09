// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  title: 'Support',
  type: 'group',
  children: [

    //Side Navigation bar support hidden
    // {
    //   id: 'sample-page',
    //   title: 'Trade with Us',
    //   type: 'item',
    //   url: '/sample-page',
    //   icon: icons.ChromeOutlined
    // },
    // {
    //   id: 'documentation',
    //   title: 'Contact Us',
    //   type: 'item',
    //   url: 'https://codedthemes.gitbook.io/mantis/',
    //   icon: icons.QuestionOutlined,
    //   external: true,
    //   target: true
    // },
    {
      id: 'documentation',
      title: 'Feedback',
      type: 'item',
      url: '',
      // icon: icons.QuestionOutlined,
      external: true,
      target: true
    }
  ]
};

export default support;

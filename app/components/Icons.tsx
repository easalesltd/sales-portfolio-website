'use client';

import { FaEnvelope, FaInstagram, FaLinkedin, FaCalendarCheck } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface IconsType {
  Email: IconType;
  Instagram: IconType;
  LinkedIn: IconType;
  Calendar: IconType;
}

const Icons: IconsType = {
  Email: FaEnvelope,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedin,
  Calendar: FaCalendarCheck
};

export default Icons; 
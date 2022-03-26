import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, Form } from 'semantic-ui-react';
import TranslateIcon from '@mui/icons-material/Translate';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// ac
import { loginActionCreator } from '../../actionCreators/authActionCreators';

// mui
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// css
import './signup.css';

const countryOptions = [
  { key: 'af', value: '6205d501d1a32299c6c3f5a7', flag: 'af', text: 'Afghanistan' },
  { key: 'al', value: '6205d501d1a32299c6c3f5a8', flag: 'al', text: 'Albania' },
  { key: 'dz', value: '6205d501d1a32299c6c3f5a9', flag: 'dz', text: 'Algeria' },
  { key: 'as', value: '6205d501d1a32299c6c3f5aa', flag: 'as', text: 'American Samoa' },
  { key: 'ad', value: '6205d501d1a32299c6c3f5ab', flag: 'ad', text: 'Andorra' },
  { key: 'ao', value: '6205d501d1a32299c6c3f5ac', flag: 'ao', text: 'Angola' },
  { key: 'ai', value: '6205d501d1a32299c6c3f5ad', flag: 'ai', text: 'Anguilla' },
  { key: 'aq', value: '6205d501d1a32299c6c3f5ae', flag: 'aq', text: 'Antarctica' },
  { key: 'ag', value: '6205d501d1a32299c6c3f5af', flag: 'ag', text: 'Antigua and Barbuda' },
  { key: 'ar', value: '6205d501d1a32299c6c3f5b0', flag: 'ar', text: 'Argentina' },
  { key: 'am', value: '6205d501d1a32299c6c3f5b1', flag: 'am', text: 'Armenia' },
  { key: 'aw', value: '6205d501d1a32299c6c3f5b2', flag: 'aw', text: 'Aruba' },
  { key: 'au', value: '6205d501d1a32299c6c3f5b3', flag: 'au', text: 'Australia' },
  { key: 'at', value: '6205d501d1a32299c6c3f5b4', flag: 'at', text: 'Austria' },
  { key: 'az', value: '6205d501d1a32299c6c3f5b5', flag: 'az', text: 'Azerbaijan' },
  { key: 'bs', value: '6205d501d1a32299c6c3f5b6', flag: 'bs', text: 'Bahamas' },
  { key: 'bh', value: '6205d501d1a32299c6c3f5b7', flag: 'bh', text: 'Bahrain' },
  { key: 'bd', value: '6205d501d1a32299c6c3f5b8', flag: 'bd', text: 'Bangladesh' },
  { key: 'bb', value: '6205d501d1a32299c6c3f5b9', flag: 'bb', text: 'Barbados' },
  { key: 'by', value: '6205d501d1a32299c6c3f5ba', flag: 'by', text: 'Belarus' },
  { key: 'be', value: '6205d501d1a32299c6c3f5bb', flag: 'be', text: 'Belgium' },
  { key: 'bz', value: '6205d501d1a32299c6c3f5bc', flag: 'bz', text: 'Belize' },
  { key: 'bj', value: '6205d501d1a32299c6c3f5bd', flag: 'bj', text: 'Benin' },
  { key: 'bm', value: '6205d501d1a32299c6c3f5be', flag: 'bm', text: 'Bermuda' },
  { key: 'bt', value: '6205d501d1a32299c6c3f5bf', flag: 'bt', text: 'Bhutan' },
  { key: 'bo', value: '6205d501d1a32299c6c3f5c0', flag: 'bo', text: 'Bolivia' },
  { key: 'ba', value: '6205d501d1a32299c6c3f5c1', flag: 'ba', text: 'Bosnia and Herzegovina' },
  { key: 'bw', value: '6205d501d1a32299c6c3f5c2', flag: 'bw', text: 'Botswana' },
  { key: 'bv', value: '6205d501d1a32299c6c3f5c3', flag: 'bv', text: 'Bouvet Island' },
  { key: 'br', value: '6205d501d1a32299c6c3f5c4', flag: 'br', text: 'Brazil' },
  { key: 'io', value: '6205d501d1a32299c6c3f5c5', flag: 'io', text: 'British Indian Ocean Territory' },
  { key: 'vg', value: '6205d501d1a32299c6c3f5c6', flag: 'vg', text: 'British Virgin Islands' },
  { key: 'bn', value: '6205d501d1a32299c6c3f5c7', flag: 'bn', text: 'Brunei' },
  { key: 'bg', value: '6205d501d1a32299c6c3f5c8', flag: 'bg', text: 'Bulgaria' },
  { key: 'bf', value: '6205d501d1a32299c6c3f5c9', flag: 'bf', text: 'Burkina Faso' },
  { key: 'bi', value: '6205d501d1a32299c6c3f5ca', flag: 'bi', text: 'Burundi' },
  { key: 'kh', value: '6205d501d1a32299c6c3f5cb', flag: 'kh', text: 'Cambodia' },
  { key: 'cm', value: '6205d501d1a32299c6c3f5cc', flag: 'cm', text: 'Cameroon' },
  { key: 'ca', value: '6205d501d1a32299c6c3f5cd', flag: 'ca', text: 'Canada' },
  { key: 'cv', value: '6205d501d1a32299c6c3f5ce', flag: 'cv', text: 'Cape Verde' },
  { key: 'bq', value: '6205d501d1a32299c6c3f5cf', flag: 'bq', text: 'Caribbean Netherlands' },
  { key: 'ky', value: '6205d501d1a32299c6c3f5d0', flag: 'ky', text: 'Cayman Islands' },
  { key: 'cf', value: '6205d501d1a32299c6c3f5d1', flag: 'cf', text: 'Central African Republic' },
  { key: 'td', value: '6205d501d1a32299c6c3f5d2', flag: 'td', text: 'Chad' },
  { key: 'cl', value: '6205d501d1a32299c6c3f5d3', flag: 'cl', text: 'Chile' },
  { key: 'cn', value: '6205d501d1a32299c6c3f5d4', flag: 'cn', text: 'China' },
  { key: 'cx', value: '6205d501d1a32299c6c3f5d5', flag: 'cx', text: 'Christmas Island' },
  { key: 'cc', value: '6205d501d1a32299c6c3f5d6', flag: 'cc', text: 'Cocos (Keeling) Islands' },
  { key: 'co', value: '6205d501d1a32299c6c3f5d7', flag: 'co', text: 'Colombia' },
  { key: 'km', value: '6205d501d1a32299c6c3f5d8', flag: 'km', text: 'Comoros' },
  { key: 'ck', value: '6205d501d1a32299c6c3f5d9', flag: 'ck', text: 'Cook Islands' },
  { key: 'cr', value: '6205d501d1a32299c6c3f5da', flag: 'cr', text: 'Costa Rica' },
  { key: 'hr', value: '6205d501d1a32299c6c3f5db', flag: 'hr', text: 'Croatia' },
  { key: 'cu', value: '6205d501d1a32299c6c3f5dc', flag: 'cu', text: 'Cuba' },
  { key: 'cw', value: '6205d501d1a32299c6c3f5dd', flag: 'cw', text: 'Curaçao' },
  { key: 'cy', value: '6205d501d1a32299c6c3f5de', flag: 'cy', text: 'Cyprus' },
  { key: 'cz', value: '6205d501d1a32299c6c3f5df', flag: 'cz', text: 'Czechia' },
  { key: 'cd', value: '6205d501d1a32299c6c3f5e0', flag: 'cd', text: 'DR Congo' },
  { key: 'dk', value: '6205d501d1a32299c6c3f5e1', flag: 'dk', text: 'Denmark' },
  { key: 'dj', value: '6205d501d1a32299c6c3f5e2', flag: 'dj', text: 'Djibouti' },
  { key: 'dm', value: '6205d501d1a32299c6c3f5e3', flag: 'dm', text: 'Dominica' },
  { key: 'do', value: '6205d501d1a32299c6c3f5e4', flag: 'do', text: 'Dominican Republic' },
  { key: 'ec', value: '6205d501d1a32299c6c3f5e5', flag: 'ec', text: 'Ecuador' },
  { key: 'eg', value: '6205d501d1a32299c6c3f5e6', flag: 'eg', text: 'Egypt' },
  { key: 'sv', value: '6205d501d1a32299c6c3f5e7', flag: 'sv', text: 'El Salvador' },
  { key: 'gq', value: '6205d501d1a32299c6c3f5e8', flag: 'gq', text: 'Equatorial Guinea' },
  { key: 'er', value: '6205d501d1a32299c6c3f5e9', flag: 'er', text: 'Eritrea' },
  { key: 'ee', value: '6205d501d1a32299c6c3f5ea', flag: 'ee', text: 'Estonia' },
  { key: 'sz', value: '6205d501d1a32299c6c3f5eb', flag: 'sz', text: 'Eswatini' },
  { key: 'et', value: '6205d501d1a32299c6c3f5ec', flag: 'et', text: 'Ethiopia' },
  { key: 'fk', value: '6205d501d1a32299c6c3f5ed', flag: 'fk', text: 'Falkland Islands' },
  { key: 'fo', value: '6205d501d1a32299c6c3f5ee', flag: 'fo', text: 'Faroe Islands' },
  { key: 'fj', value: '6205d501d1a32299c6c3f5ef', flag: 'fj', text: 'Fiji' },
  { key: 'fi', value: '6205d501d1a32299c6c3f5f0', flag: 'fi', text: 'Finland' },
  { key: 'fr', value: '6205d501d1a32299c6c3f5f1', flag: 'fr', text: 'France' },
  { key: 'gf', value: '6205d501d1a32299c6c3f5f2', flag: 'gf', text: 'French Guiana' },
  { key: 'pf', value: '6205d501d1a32299c6c3f5f3', flag: 'pf', text: 'French Polynesia' },
  { key: 'tf', value: '6205d501d1a32299c6c3f5f4', flag: 'tf', text: 'French Southern and Antarctic Lands' },
  { key: 'ga', value: '6205d501d1a32299c6c3f5f5', flag: 'ga', text: 'Gabon' },
  { key: 'gm', value: '6205d501d1a32299c6c3f5f6', flag: 'gm', text: 'Gambia' },
  { key: 'ge', value: '6205d501d1a32299c6c3f5f7', flag: 'ge', text: 'Georgia' },
  { key: 'de', value: '6205d501d1a32299c6c3f5f8', flag: 'de', text: 'Germany' },
  { key: 'gh', value: '6205d501d1a32299c6c3f5f9', flag: 'gh', text: 'Ghana' },
  { key: 'gi', value: '6205d501d1a32299c6c3f5fa', flag: 'gi', text: 'Gibraltar' },
  { key: 'gr', value: '6205d501d1a32299c6c3f5fb', flag: 'gr', text: 'Greece' },
  { key: 'gl', value: '6205d501d1a32299c6c3f5fc', flag: 'gl', text: 'Greenland' },
  { key: 'gd', value: '6205d501d1a32299c6c3f5fd', flag: 'gd', text: 'Grenada' },
  { key: 'gp', value: '6205d501d1a32299c6c3f5fe', flag: 'gp', text: 'Guadeloupe' },
  { key: 'gu', value: '6205d501d1a32299c6c3f5ff', flag: 'gu', text: 'Guam' },
  { key: 'gt', value: '6205d501d1a32299c6c3f600', flag: 'gt', text: 'Guatemala' },
  { key: 'gg', value: '6205d501d1a32299c6c3f601', flag: 'gg', text: 'Guernsey' },
  { key: 'gn', value: '6205d501d1a32299c6c3f602', flag: 'gn', text: 'Guinea' },
  { key: 'gw', value: '6205d501d1a32299c6c3f603', flag: 'gw', text: 'Guinea-Bissau' },
  { key: 'gy', value: '6205d501d1a32299c6c3f604', flag: 'gy', text: 'Guyana' },
  { key: 'ht', value: '6205d501d1a32299c6c3f605', flag: 'ht', text: 'Haiti' },
  { key: 'hm', value: '6205d501d1a32299c6c3f606', flag: 'hm', text: 'Heard Island and McDonald Islands' },
  { key: 'hn', value: '6205d501d1a32299c6c3f607', flag: 'hn', text: 'Honduras' },
  { key: 'hk', value: '6205d501d1a32299c6c3f608', flag: 'hk', text: 'Hong Kong' },
  { key: 'hu', value: '6205d501d1a32299c6c3f609', flag: 'hu', text: 'Hungary' },
  { key: 'is', value: '6205d501d1a32299c6c3f60a', flag: 'is', text: 'Iceland' },
  { key: 'in', value: '6205d501d1a32299c6c3f60b', flag: 'in', text: 'India' },
  { key: 'id', value: '6205d501d1a32299c6c3f60c', flag: 'id', text: 'Indonesia' },
  { key: 'ir', value: '6205d501d1a32299c6c3f60d', flag: 'ir', text: 'Iran' },
  { key: 'iq', value: '6205d501d1a32299c6c3f60e', flag: 'iq', text: 'Iraq' },
  { key: 'ie', value: '6205d501d1a32299c6c3f60f', flag: 'ie', text: 'Ireland' },
  { key: 'im', value: '6205d501d1a32299c6c3f610', flag: 'im', text: 'Isle of Man' },
  { key: 'il', value: '6205d501d1a32299c6c3f611', flag: 'il', text: 'Israel' },
  { key: 'it', value: '6205d501d1a32299c6c3f612', flag: 'it', text: 'Italy' },
  { key: 'ci', value: '6205d501d1a32299c6c3f613', flag: 'ci', text: 'Ivory Coast' },
  { key: 'jm', value: '6205d501d1a32299c6c3f614', flag: 'jm', text: 'Jamaica' },
  { key: 'jp', value: '6205d501d1a32299c6c3f615', flag: 'jp', text: 'Japan' },
  { key: 'je', value: '6205d501d1a32299c6c3f616', flag: 'je', text: 'Jersey' },
  { key: 'jo', value: '6205d501d1a32299c6c3f617', flag: 'jo', text: 'Jordan' },
  { key: 'kz', value: '6205d501d1a32299c6c3f618', flag: 'kz', text: 'Kazakhstan' },
  { key: 'ke', value: '6205d501d1a32299c6c3f619', flag: 'ke', text: 'Kenya' },
  { key: 'ki', value: '6205d501d1a32299c6c3f61a', flag: 'ki', text: 'Kiribati' },
  { key: 'xk', value: '6205d501d1a32299c6c3f61b', flag: 'xk', text: 'Kosovo' },
  { key: 'kw', value: '6205d501d1a32299c6c3f61c', flag: 'kw', text: 'Kuwait' },
  { key: 'kg', value: '6205d501d1a32299c6c3f61d', flag: 'kg', text: 'Kyrgyzstan' },
  { key: 'la', value: '6205d501d1a32299c6c3f61e', flag: 'la', text: 'Laos' },
  { key: 'lv', value: '6205d501d1a32299c6c3f61f', flag: 'lv', text: 'Latvia' },
  { key: 'lb', value: '6205d501d1a32299c6c3f620', flag: 'lb', text: 'Lebanon' },
  { key: 'ls', value: '6205d501d1a32299c6c3f621', flag: 'ls', text: 'Lesotho' },
  { key: 'lr', value: '6205d501d1a32299c6c3f622', flag: 'lr', text: 'Liberia' },
  { key: 'ly', value: '6205d501d1a32299c6c3f623', flag: 'ly', text: 'Libya' },
  { key: 'li', value: '6205d501d1a32299c6c3f624', flag: 'li', text: 'Liechtenstein' },
  { key: 'lt', value: '6205d501d1a32299c6c3f625', flag: 'lt', text: 'Lithuania' },
  { key: 'lu', value: '6205d501d1a32299c6c3f626', flag: 'lu', text: 'Luxembourg' },
  { key: 'mo', value: '6205d501d1a32299c6c3f627', flag: 'mo', text: 'Macau' },
  { key: 'mg', value: '6205d501d1a32299c6c3f628', flag: 'mg', text: 'Madagascar' },
  { key: 'mw', value: '6205d501d1a32299c6c3f629', flag: 'mw', text: 'Malawi' },
  { key: 'my', value: '6205d501d1a32299c6c3f62a', flag: 'my', text: 'Malaysia' },
  { key: 'mv', value: '6205d501d1a32299c6c3f62b', flag: 'mv', text: 'Maldives' },
  { key: 'ml', value: '6205d501d1a32299c6c3f62c', flag: 'ml', text: 'Mali' },
  { key: 'mt', value: '6205d501d1a32299c6c3f62d', flag: 'mt', text: 'Malta' },
  { key: 'mh', value: '6205d501d1a32299c6c3f62e', flag: 'mh', text: 'Marshall Islands' },
  { key: 'mq', value: '6205d501d1a32299c6c3f62f', flag: 'mq', text: 'Martinique' },
  { key: 'mr', value: '6205d501d1a32299c6c3f630', flag: 'mr', text: 'Mauritania' },
  { key: 'mu', value: '6205d501d1a32299c6c3f631', flag: 'mu', text: 'Mauritius' },
  { key: 'yt', value: '6205d501d1a32299c6c3f632', flag: 'yt', text: 'Mayotte' },
  { key: 'mx', value: '6205d501d1a32299c6c3f633', flag: 'mx', text: 'Mexico' },
  { key: 'fm', value: '6205d501d1a32299c6c3f634', flag: 'fm', text: 'Micronesia' },
  { key: 'md', value: '6205d501d1a32299c6c3f635', flag: 'md', text: 'Moldova' },
  { key: 'mc', value: '6205d501d1a32299c6c3f636', flag: 'mc', text: 'Monaco' },
  { key: 'mn', value: '6205d501d1a32299c6c3f637', flag: 'mn', text: 'Mongolia' },
  { key: 'me', value: '6205d501d1a32299c6c3f638', flag: 'me', text: 'Montenegro' },
  { key: 'ms', value: '6205d501d1a32299c6c3f639', flag: 'ms', text: 'Montserrat' },
  { key: 'ma', value: '6205d501d1a32299c6c3f63a', flag: 'ma', text: 'Morocco' },
  { key: 'mz', value: '6205d501d1a32299c6c3f63b', flag: 'mz', text: 'Mozambique' },
  { key: 'mm', value: '6205d501d1a32299c6c3f63c', flag: 'mm', text: 'Myanmar' },
  { key: 'na', value: '6205d501d1a32299c6c3f63d', flag: 'na', text: 'Namibia' },
  { key: 'nr', value: '6205d501d1a32299c6c3f63e', flag: 'nr', text: 'Nauru' },
  { key: 'np', value: '6205d501d1a32299c6c3f63f', flag: 'np', text: 'Nepal' },
  { key: 'nl', value: '6205d501d1a32299c6c3f640', flag: 'nl', text: 'Netherlands' },
  { key: 'nc', value: '6205d501d1a32299c6c3f641', flag: 'nc', text: 'New Caledonia' },
  { key: 'nz', value: '6205d501d1a32299c6c3f642', flag: 'nz', text: 'New Zealand' },
  { key: 'ni', value: '6205d501d1a32299c6c3f643', flag: 'ni', text: 'Nicaragua' },
  { key: 'ne', value: '6205d501d1a32299c6c3f644', flag: 'ne', text: 'Niger' },
  { key: 'ng', value: '6205d501d1a32299c6c3f645', flag: 'ng', text: 'Nigeria' },
  { key: 'nu', value: '6205d501d1a32299c6c3f646', flag: 'nu', text: 'Niue' },
  { key: 'nf', value: '6205d501d1a32299c6c3f647', flag: 'nf', text: 'Norfolk Island' },
  { key: 'kp', value: '6205d501d1a32299c6c3f648', flag: 'kp', text: 'North Korea' },
  { key: 'mk', value: '6205d501d1a32299c6c3f649', flag: 'mk', text: 'North Macedonia' },
  { key: 'mp', value: '6205d501d1a32299c6c3f64a', flag: 'mp', text: 'Northern Mariana Islands' },
  { key: 'no', value: '6205d501d1a32299c6c3f64b', flag: 'no', text: 'Norway' },
  { key: 'om', value: '6205d501d1a32299c6c3f64c', flag: 'om', text: 'Oman' },
  { key: 'pk', value: '6205d501d1a32299c6c3f64d', flag: 'pk', text: 'Pakistan' },
  { key: 'pw', value: '6205d501d1a32299c6c3f64e', flag: 'pw', text: 'Palau' },
  { key: 'ps', value: '6205d501d1a32299c6c3f64f', flag: 'ps', text: 'Palestine' },
  { key: 'pa', value: '6205d501d1a32299c6c3f650', flag: 'pa', text: 'Panama' },
  { key: 'pg', value: '6205d501d1a32299c6c3f651', flag: 'pg', text: 'Papua New Guinea' },
  { key: 'py', value: '6205d501d1a32299c6c3f652', flag: 'py', text: 'Paraguay' },
  { key: 'pe', value: '6205d501d1a32299c6c3f653', flag: 'pe', text: 'Peru' },
  { key: 'ph', value: '6205d501d1a32299c6c3f654', flag: 'ph', text: 'Philippines' },
  { key: 'pn', value: '6205d501d1a32299c6c3f655', flag: 'pn', text: 'Pitcairn Islands' },
  { key: 'pl', value: '6205d501d1a32299c6c3f656', flag: 'pl', text: 'Poland' },
  { key: 'pt', value: '6205d501d1a32299c6c3f657', flag: 'pt', text: 'Portugal' },
  { key: 'pr', value: '6205d501d1a32299c6c3f658', flag: 'pr', text: 'Puerto Rico' },
  { key: 'qa', value: '6205d501d1a32299c6c3f659', flag: 'qa', text: 'Qatar' },
  { key: 'cg', value: '6205d501d1a32299c6c3f65a', flag: 'cg', text: 'Republic of the Congo' },
  { key: 'ro', value: '6205d501d1a32299c6c3f65b', flag: 'ro', text: 'Romania' },
  { key: 'ru', value: '6205d501d1a32299c6c3f65c', flag: 'ru', text: 'Russia' },
  { key: 'rw', value: '6205d501d1a32299c6c3f65d', flag: 'rw', text: 'Rwanda' },
  { key: 're', value: '6205d501d1a32299c6c3f65e', flag: 're', text: 'Réunion' },
  { key: 'bl', value: '6205d501d1a32299c6c3f65f', flag: 'bl', text: 'Saint Barthélemy' },
  {
    key: 'sh',
    value: '6205d501d1a32299c6c3f660',
    flag: 'sh',
    text: 'Saint Helena, Ascension and Tristan da Cunha',
  },
  { key: 'kn', value: '6205d501d1a32299c6c3f661', flag: 'kn', text: 'Saint Kitts and Nevis' },
  { key: 'lc', value: '6205d501d1a32299c6c3f662', flag: 'lc', text: 'Saint Lucia' },
  { key: 'mf', value: '6205d501d1a32299c6c3f663', flag: 'mf', text: 'Saint Martin' },
  { key: 'pm', value: '6205d501d1a32299c6c3f664', flag: 'pm', text: 'Saint Pierre and Miquelon' },
  { key: 'vc', value: '6205d501d1a32299c6c3f665', flag: 'vc', text: 'Saint Vincent and the Grenadines' },
  { key: 'ws', value: '6205d501d1a32299c6c3f666', flag: 'ws', text: 'Samoa' },
  { key: 'sm', value: '6205d501d1a32299c6c3f667', flag: 'sm', text: 'San Marino' },
  { key: 'sa', value: '6205d501d1a32299c6c3f668', flag: 'sa', text: 'Saudi Arabia' },
  { key: 'sn', value: '6205d501d1a32299c6c3f669', flag: 'sn', text: 'Senegal' },
  { key: 'rs', value: '6205d501d1a32299c6c3f66a', flag: 'rs', text: 'Serbia' },
  { key: 'sc', value: '6205d501d1a32299c6c3f66b', flag: 'sc', text: 'Seychelles' },
  { key: 'sl', value: '6205d501d1a32299c6c3f66c', flag: 'sl', text: 'Sierra Leone' },
  { key: 'sg', value: '6205d501d1a32299c6c3f66d', flag: 'sg', text: 'Singapore' },
  { key: 'sx', value: '6205d501d1a32299c6c3f66e', flag: 'sx', text: 'Sint Maarten' },
  { key: 'sk', value: '6205d501d1a32299c6c3f66f', flag: 'sk', text: 'Slovakia' },
  { key: 'si', value: '6205d501d1a32299c6c3f670', flag: 'si', text: 'Slovenia' },
  { key: 'sb', value: '6205d501d1a32299c6c3f671', flag: 'sb', text: 'Solomon Islands' },
  { key: 'so', value: '6205d501d1a32299c6c3f672', flag: 'so', text: 'Somalia' },
  { key: 'za', value: '6205d501d1a32299c6c3f673', flag: 'za', text: 'South Africa' },
  { key: 'gs', value: '6205d501d1a32299c6c3f674', flag: 'gs', text: 'South Georgia' },
  { key: 'kr', value: '6205d501d1a32299c6c3f675', flag: 'kr', text: 'South Korea' },
  { key: 'ss', value: '6205d501d1a32299c6c3f676', flag: 'ss', text: 'South Sudan' },
  { key: 'es', value: '6205d501d1a32299c6c3f677', flag: 'es', text: 'Spain' },
  { key: 'lk', value: '6205d501d1a32299c6c3f678', flag: 'lk', text: 'Sri Lanka' },
  { key: 'sd', value: '6205d501d1a32299c6c3f679', flag: 'sd', text: 'Sudan' },
  { key: 'sr', value: '6205d501d1a32299c6c3f67a', flag: 'sr', text: 'Suriname' },
  { key: 'sj', value: '6205d501d1a32299c6c3f67b', flag: 'sj', text: 'Svalbard and Jan Mayen' },
  { key: 'se', value: '6205d501d1a32299c6c3f67c', flag: 'se', text: 'Sweden' },
  { key: 'ch', value: '6205d501d1a32299c6c3f67d', flag: 'ch', text: 'Switzerland' },
  { key: 'sy', value: '6205d501d1a32299c6c3f67e', flag: 'sy', text: 'Syria' },
  { key: 'st', value: '6205d501d1a32299c6c3f67f', flag: 'st', text: 'São Tomé and Príncipe' },
  { key: 'tw', value: '6205d501d1a32299c6c3f680', flag: 'tw', text: 'Taiwan' },
  { key: 'tj', value: '6205d501d1a32299c6c3f681', flag: 'tj', text: 'Tajikistan' },
  { key: 'tz', value: '6205d501d1a32299c6c3f682', flag: 'tz', text: 'Tanzania' },
  { key: 'th', value: '6205d501d1a32299c6c3f683', flag: 'th', text: 'Thailand' },
  { key: 'tl', value: '6205d501d1a32299c6c3f684', flag: 'tl', text: 'Timor-Leste' },
  { key: 'tg', value: '6205d501d1a32299c6c3f685', flag: 'tg', text: 'Togo' },
  { key: 'tk', value: '6205d501d1a32299c6c3f686', flag: 'tk', text: 'Tokelau' },
  { key: 'to', value: '6205d501d1a32299c6c3f687', flag: 'to', text: 'Tonga' },
  { key: 'tt', value: '6205d501d1a32299c6c3f688', flag: 'tt', text: 'Trinidad and Tobago' },
  { key: 'tn', value: '6205d501d1a32299c6c3f689', flag: 'tn', text: 'Tunisia' },
  { key: 'tr', value: '6205d501d1a32299c6c3f68a', flag: 'tr', text: 'Turkey' },
  { key: 'tm', value: '6205d501d1a32299c6c3f68b', flag: 'tm', text: 'Turkmenistan' },
  { key: 'tc', value: '6205d501d1a32299c6c3f68c', flag: 'tc', text: 'Turks and Caicos Islands' },
  { key: 'tv', value: '6205d501d1a32299c6c3f68d', flag: 'tv', text: 'Tuvalu' },
  { key: 'ug', value: '6205d501d1a32299c6c3f68e', flag: 'ug', text: 'Uganda' },
  { key: 'ua', value: '6205d501d1a32299c6c3f68f', flag: 'ua', text: 'Ukraine' },
  { key: 'ae', value: '6205d501d1a32299c6c3f690', flag: 'ae', text: 'United Arab Emirates' },
  { key: 'gb', value: '6205d501d1a32299c6c3f691', flag: 'gb', text: 'United Kingdom' },
  { key: 'us', value: '6205d501d1a32299c6c3f692', flag: 'us', text: 'United States' },
  { key: 'um', value: '6205d501d1a32299c6c3f693', flag: 'um', text: 'United States Minor Outlying Islands' },
  { key: 'vi', value: '6205d501d1a32299c6c3f694', flag: 'vi', text: 'United States Virgin Islands' },
  { key: 'uy', value: '6205d501d1a32299c6c3f695', flag: 'uy', text: 'Uruguay' },
  { key: 'uz', value: '6205d501d1a32299c6c3f696', flag: 'uz', text: 'Uzbekistan' },
  { key: 'vu', value: '6205d501d1a32299c6c3f697', flag: 'vu', text: 'Vanuatu' },
  { key: 'va', value: '6205d501d1a32299c6c3f698', flag: 'va', text: 'Vatican City' },
  { key: 've', value: '6205d501d1a32299c6c3f699', flag: 've', text: 'Venezuela' },
  { key: 'vn', value: '6205d501d1a32299c6c3f69a', flag: 'vn', text: 'Vietnam' },
  { key: 'wf', value: '6205d501d1a32299c6c3f69b', flag: 'wf', text: 'Wallis and Futuna' },
  { key: 'eh', value: '6205d501d1a32299c6c3f69c', flag: 'eh', text: 'Western Sahara' },
  { key: 'ye', value: '6205d501d1a32299c6c3f69d', flag: 'ye', text: 'Yemen' },
  { key: 'zm', value: '6205d501d1a32299c6c3f69e', flag: 'zm', text: 'Zambia' },
  { key: 'zw', value: '6205d501d1a32299c6c3f69f', flag: 'zw', text: 'Zimbabwe' },
  { key: 'ax', value: '6205d501d1a32299c6c3f6a0', flag: 'ax', text: 'Åland Islands' },
];

const languageOptions = [
  { key: '61711a02dc33a75226a7f363', value: '61711a02dc33a75226a7f363', text: 'English' },
  { key: '61711a02dc33a75226a7f358', value: '61711a02dc33a75226a7f358', text: '中文' },
  { key: '61711a02dc33a75226a7f36a', value: '61711a02dc33a75226a7f36a', text: 'Français' },
  { key: '61711a02dc33a75226a7f3cf', value: '61711a02dc33a75226a7f3cf', text: 'Español' },
  { key: '61711a02dc33a75226a7f36e', value: '61711a02dc33a75226a7f36e', text: 'Deutsch' },
  { key: '61711a02dc33a75226a7f381', value: '61711a02dc33a75226a7f381', text: 'Italiano' },
  { key: '61711a02dc33a75226a7f3bb', value: '61711a02dc33a75226a7f3bb', text: 'Português' },
  { key: '61711a02dc33a75226a7f383', value: '61711a02dc33a75226a7f383', text: '日本語' },
  { key: '61711a02dc33a75226a7f3c0', value: '61711a02dc33a75226a7f3c0', text: 'Русский' },
  { key: '61711a02dc33a75226a7f390', value: '61711a02dc33a75226a7f390', text: '한국인' },
  { key: '61711a02dc33a75226a7f341', value: '61711a02dc33a75226a7f341', text: 'عربى' },
  { key: '61711a02dc33a75226a7f376', value: '61711a02dc33a75226a7f376', text: 'हिन्दी' },
  { key: '61711a02dc33a75226a7f361', value: '61711a02dc33a75226a7f361', text: 'Nederlands' },
  { key: '61711a02dc33a75226a7f3b9', value: '61711a02dc33a75226a7f3b9', text: 'Polskie' },
  { key: '61711a02dc33a75226a7f3d3', value: '61711a02dc33a75226a7f3d3', text: 'Svenska' },
  { key: '61711a02dc33a75226a7f369', value: '61711a02dc33a75226a7f369', text: 'Suomi ' },
  { key: '61711a02dc33a75226a7f3ad', value: '61711a02dc33a75226a7f3ad', text: 'Norsk' },
  { key: '61711a02dc33a75226a7f35e', value: '61711a02dc33a75226a7f35e', text: 'Čeština' },
  { key: '61711a02dc33a75226a7f3de', value: '61711a02dc33a75226a7f3de', text: 'Türkçe' },
  { key: '61b42360476ed2196992b77e', value: '61b42360476ed2196992b77e', text: 'Limba Română' },
  { key: '61b422eb476ed2196992b77d', value: '61b422eb476ed2196992b77d', text: 'עִבְרִית' },
  { key: '61b4312f92ae00c28783dd1b', value: '61b4312f92ae00c28783dd1b', text: 'Ελληνικά' },
];

const DetailInfo = (props) => {
  return (
    // <Form>
    <>
      {/* <Form.Field style={{ marginBottom: '40px' }}> */}
      <label>
        <TranslateIcon />
        &nbsp;Learning Language
      </label>
      {/* <Dropdown
          placeholder='Which languages are you learning?'
          fluid
          multiple
          selection
          options={languageOptions}
          onChange={(event, data) => props.setLearningLanguages(data.value)}
          value={props.learningLanguages}
        /> */}
      <Autocomplete
        multiple
        id='tags-outlined'
        options={languageOptions}
        getOptionLabel={(option) => option.text}
        // defaultValue={[top100Films[13]]}
        onChange={(event, value) => props.setLearningLanguages(value)}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label='Choose language (You can choose multiple languages!)'
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      />
      {/* </Form.Field> */}

      {/* <Form.Field style={{ marginBottom: '40px' }}> */}
      <label>
        <TranslateIcon />
        &nbsp;Native Language
      </label>
      {/* <Dropdown
          placeholder='Which languages do you speak fluently?'
          fluid
          multiple
          selection
          options={languageOptions}
          onChange={(event, data) => props.setNativeLanguages(data.value)}
          value={props.nativeLanguages}
        /> */}
      <Autocomplete
        multiple
        id='tags-outlined'
        options={languageOptions}
        getOptionLabel={(option) => option.text}
        // defaultValue={[top100Films[13]]}
        onChange={(event, value) => props.setNativeLanguages(value)}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label='Choose language (You can choose multiple languages!)'
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      />
      {/* </Form.Field> */}

      {/* <Form.Field style={{ marginBottom: '40px' }}> */}
      <label>
        <LanguageIcon />
        &nbsp;Nationality
      </label>
      {/* <Dropdown
          placeholder='What is your nationality?'
          fluid
          multiple
          selection
          options={countryOptions}
          onChange={(event, data) => props.setNationalities(data.value)}
          value={props.nationalities}
        /> */}
      <Autocomplete
        multiple
        id='tags-outlined'
        options={countryOptions}
        getOptionLabel={(option) => option.text}
        // defaultValue={[top100Films[13]]}
        filterSelectedOptions
        onChange={(event, value) => props.setNationalities(value)}
        renderOption={(props, option) => (
          <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <img
              loading='lazy'
              width='20'
              src={`https://flagcdn.com/w20/${option.key}.png`}
              srcSet={`https://flagcdn.com/w40/${option.key}.png 2x`}
              alt=''
            />
            {option.text}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Choose country(You can choose multiple country!)'
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      />
      {/* </Form.Field> */}

      {/* <Form.Field style={{ marginBottom: '40px' }}> */}
      <label>
        <LanguageIcon />
        &nbsp; Place
      </label>
      <Dropdown
        placeholder='Which country are you living in?'
        fluid
        selection
        options={countryOptions}
        onChange={(event, data) => props.setLocation(data.value)}
        value={props.location}
      />
      {/* <Autocomplete
        // multiple
        id='tags-outlined'
        options={countryOptions}
        getOptionLabel={(option) => option.text}
        // defaultValue={[top100Films[13]]}
        filterSelectedOptions
        onChange={(event, value) => props.setLocation(value)}
        renderOption={(props, option) => (
          <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <img
              loading='lazy'
              width='20'
              src={`https://flagcdn.com/w20/${option.key}.png`}
              srcSet={`https://flagcdn.com/w40/${option.key}.png 2x`}
              alt=''
            />
            {option.text}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Choose country(You can choose multiple country!)'
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      /> */}
      {/* </Form.Field> */}

      {/* <Form.Field>
        <label>Job (Not required)</label>
        <input type='text' placeholder='What is your job?' onChange={() } />
      </Form.Field> */}
    </>
  );
};

export default connect(null, { loginActionCreator })(DetailInfo);

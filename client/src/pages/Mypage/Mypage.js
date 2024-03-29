import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Mypage.scss';
import axios from 'axios';
import { API_URL } from '../../config/contansts';
import LoansTable from '../../components/Mypage/LoansTable/LoansTable';
import { LiaUserEditSolid } from "react-icons/lia";
import { useRecoilState } from "recoil";
import { loginState } from "../../recoil/atoms/State";
import { errHandler } from '../../utils/globalFunction';

const Mypage = () => {
  const [islogin, setIslogin] = useRecoilState(loginState);
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState([]);
  const [event, setEvent] = useState([]);
  const [faq, setFaq] = useState([]);
  const [showAllEvent, setShowAllEvent] = useState(false);
  const [showBriefViewEvent, setShowBriefViewEvent] = useState(false);
  const [showAllFaq, setShowAllFaq] = useState(false);
  const [showBriefViewFaq, setShowBriefViewFaq] = useState(false);

  const navigate = useNavigate();


  const getUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/user/one`);
      setUser(res.data);
      setUserId(res.data.user_id);
    } catch (error) {
      const {reLogin} = errHandler(error);
      if (reLogin === true) {
        setIslogin(false);
      }
    }
  }

  const getUserEvent = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/event_applicants/user`);
      setEvent(res.data);
      console.log("이벤트 : ", res.data);
    } catch (error) {
      console.log("이벤트 에러error: ", error);
      const {reLogin} = errHandler(error);
      if (reLogin === true) {
        setIslogin(false);
      }
    }
  }
  const getUserFaq = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/faq/user`);
      setFaq(res.data);
      console.log("FAQ : ", res.data);
    } catch (error) {
      console.log("이벤트 에러error: ", error);
      // const {reLogin} = errHandler(error);
      // // if (reLogin === true) {
      // //   setIslogin(false);
      // // }
    }
  }

  const toggleShowAllEvent = () => {
    setShowAllEvent(!showAllEvent);
    setShowBriefViewEvent(false); // "간략히 보기"를 누르면 전체 보기가 해제되도록 추가
  };
  const toggleShowBriefViewEvent = () => {
    setShowBriefViewEvent(!showBriefViewEvent);
    setShowAllEvent(false); // "더보기"를 누르면 간략히 보기가 해제되도록 추가
  };
  const toggleShowAllFaq = () => {
    setShowAllFaq(!showAllFaq);
    setShowBriefViewFaq(false); // "간략히 보기"를 누르면 전체 보기가 해제되도록 추가
  };
  const toggleShowBriefViewFaq = () => {
    setShowBriefViewFaq(!showBriefViewFaq);
    setShowAllFaq(false); // "더보기"를 누르면 간략히 보기가 해제되도록 추가
  };

  const visibleEvent = showAllEvent ? event : (showBriefViewEvent ? event.slice(0, 2) : event.slice(0, 2));
  const visibleFaq = showAllFaq ? faq : (showBriefViewFaq ? faq.slice(0, 5) : faq.slice(0, 5));

  console.log("visibleFaq : ", visibleFaq);

  useEffect(()=>{
    getUser();
    getUserEvent();
    getUserFaq();
  },[]);
  
  return (
    <div className='mypage-container-kjh'>
      <div className='pageTop-kjh'>
        <h1>{user.name}님 환영합니다.</h1>
        <NavLink to='/check' className="myEdit-kjh"><LiaUserEditSolid/>내 정보 수정/탈퇴 {'>'}</NavLink>
      </div>

  

      <div className='myTable-kjh'>

        <LoansTable is_returned={true}/>
        <LoansTable is_returned={false}/>
        <div className='myEventFaq-kjh'>
          <table>
            <tr>
              <td colSpan='4' className='eventfaqTitle-kjh'>내가 신청한 이벤트</td>
            </tr>
            {visibleEvent.map((item, index) => (
              <tr>
                <td><img src={API_URL+item.Event.event_img_url}></img></td>
                <td className='eventTitle-kjh' onClick={()=>{navigate(`/event/${item.Event.event_id}`)}}>{item.Event.event_title}</td>
                <td>{item.Event.event_start_date}</td>
                <td>{item.Event.event_end_date}</td>
              </tr>
            ))}
          </table>
          {!showAllEvent && !showBriefViewEvent && (
            <NavLink onClick={toggleShowAllEvent} className='more-kjh'>더보기 {'>'}</NavLink>
          )}
          {showAllEvent && (
            <NavLink onClick={toggleShowBriefViewEvent} className='more-kjh'>간략히 보기 {'>'}</NavLink>
          )}
          {showBriefViewEvent && (
            <NavLink onClick={toggleShowAllEvent} className='more-kjh'>더보기 {'>'}</NavLink>
          )}
        </div>
        <div className='myEventFaq-kjh'>
          <table>
            <tr>
              <td colSpan='5' className='eventfaqTitle-kjh'>FAQ</td>
            </tr>
            {visibleFaq.map((item, index) => (
              <tr>
                <td>{index+1}</td>
                <td>{item.faq_tags}</td>
                <td className='faqTitle-kjh' onClick={()=>{navigate(`/faq/${item.faq_id}`)}}>{item.faq_title}</td>
                <td>{item.created_at}</td>
                <td>{item.faq_status ? <p className='answer-kjh'>답변완료</p> : <p className='waiting-kjh'>대기중</p>}</td>
              </tr>
            ))}
          </table>
          {!showAllFaq && !showBriefViewFaq && (
            <NavLink onClick={toggleShowAllFaq} className='more-kjh'>더보기 {'>'}</NavLink>
          )}
          {showAllFaq && (
            <NavLink onClick={toggleShowBriefViewFaq} className='more-kjh'>간략히 보기 {'>'}</NavLink>
          )}
          {showBriefViewFaq && (
            <NavLink onClick={toggleShowAllFaq} className='more-kjh'>더보기 {'>'}</NavLink>
          )}
        </div>
      </div>
    </div>
  )


}

export default Mypage;

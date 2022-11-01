package com.ssafy.api.service;

import com.ssafy.api.dto.ChallengeReqDto;
import com.ssafy.api.dto.ChallengeRewardReqDto;
import com.ssafy.common.exception.CustomException;
import com.ssafy.common.exception.ErrorCode;
import com.ssafy.db.entity.Challenge;
import com.ssafy.db.entity.ChallengeInfo;
import com.ssafy.db.entity.ChallengeReward;
import com.ssafy.db.repository.ChallengeInfoRepository;
import com.ssafy.db.repository.ChallengeRepository;
import com.ssafy.db.repository.ChallengeRewardRepository;
import com.ssafy.db.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service("ChallengeService")
@Transactional(readOnly = true)
public class ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private ChallengeInfoRepository challengeInfoRepository;

    @Autowired
    private ChallengeRewardRepository challengeRewardRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Challenge createChllenge(ChallengeReqDto challengeReqDto){
        Challenge challenge = Challenge.builder()
                .challengeTitle(challengeReqDto.getChallengeTitle())
                .challengeUserId(challengeReqDto.getChallengeUserId())
                .challengeDescription(challengeReqDto.getChallengeDescription())
                .challengeParticipant(challengeReqDto.getChallengeParticipant())
                .challengeStartTime(challengeReqDto.getChallengeStartTime())
                .challengeEndTime(challengeReqDto.getChallengeEndTime())
                .build();

        return challengeRepository.save(challenge);
    }
    public List<Challenge> getChallengeList(){

        return challengeRepository.findAll();
    }


    public Optional<Challenge> getChallengeListByUserId(Long challengeId) {
        return challengeRepository.findChallengeByChallengeId(challengeId);
    }

    @Transactional
    public boolean deleteChallenge(Long challengeId) {
        Challenge challenge = challengeRepository.findChallengeByChallengeId(challengeId).orElseThrow(() -> new CustomException(ErrorCode.CHALLENEGE_NOT_FOUND));
        try {
            challengeRepository.delete(challenge);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }


    public List<ChallengeInfo> getChallengeUserList(Long challengeId) {
        Challenge challenge = challengeRepository.findChallengeByChallengeId(challengeId).orElseThrow(() -> new CustomException(ErrorCode.CHALLENEGE_NOT_FOUND));
        List<ChallengeInfo> list = challenge.getChallengeInfoList();

        return list;
    }

    @Transactional
    public ChallengeReward createChallengeReward(ChallengeRewardReqDto challengeRewardReqDto) {

        Challenge challenge= findChallenge(challengeRewardReqDto.getChallengeId());
        ChallengeReward challengeReward=null;


        //challegeReward에 challengeId가 있으면 예외처리
        if(challengeRewardRepository.findByChallengeChallengeId(challengeRewardReqDto.getChallengeId()).isPresent()){
            throw new CustomException(ErrorCode.CHALLENEGE_REWARD_ALREADY_EXIST);
        }
        else{
            challengeReward = ChallengeReward.builder()
                    .challenge(challenge)
                    .challengeRewardType(challengeRewardReqDto.getChallengeRewardType())
                    .build();
        }


        return challengeRewardRepository.save(challengeReward);
    }

    public Challenge findChallenge(Long challengeId) {
        return challengeRepository.findChallengeByChallengeId(challengeId).orElseThrow(() -> new CustomException(ErrorCode.CHALLENEGE_NOT_FOUND));
    }
}


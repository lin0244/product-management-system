package by.kraskovski.pms.service.impl;

import by.kraskovski.pms.domain.Authority;
import by.kraskovski.pms.domain.enums.AuthorityEnum;
import by.kraskovski.pms.repository.AuthorityRepository;
import by.kraskovski.pms.service.AuthorityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthorityServiceImpl implements AuthorityService {

    private final AuthorityRepository authorityRepository;

    @Autowired
    public AuthorityServiceImpl(final AuthorityRepository authorityRepository) {
        this.authorityRepository = authorityRepository;
    }

    @Override
    public Authority find(final int id) {
        return authorityRepository.findOne(id);
    }

    @Override
    public Authority findByName(final AuthorityEnum name) {
        return authorityRepository.findByAuthority(name);
    }

    @Override
    public List<Authority> findAll() {
        return authorityRepository.findAll();
    }
}

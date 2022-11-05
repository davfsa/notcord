package io.github.tandemdude.notcord.rest.repositories;

import io.github.tandemdude.notcord.commons.entities.User;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends ReactiveCrudRepository<User, String> {
}
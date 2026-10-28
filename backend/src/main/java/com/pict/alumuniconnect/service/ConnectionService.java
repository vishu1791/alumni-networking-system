package com.pict.alumuniconnect.service;

import com.pict.alumuniconnect.dto.ConnectionRequestDto;
import com.pict.alumuniconnect.entity.AlumniProfile;
import com.pict.alumuniconnect.entity.Connection;
import com.pict.alumuniconnect.entity.ConnectionStatus;
import com.pict.alumuniconnect.exception.ResourceNotFoundException;
import com.pict.alumuniconnect.repository.AlumniRepository;
import com.pict.alumuniconnect.repository.ConnectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final AlumniRepository alumniRepository;

    public ConnectionService(ConnectionRepository connectionRepository, AlumniRepository alumniRepository) {
        this.connectionRepository = connectionRepository;
        this.alumniRepository = alumniRepository;
    }

    @Transactional
    public Connection sendRequest(ConnectionRequestDto dto) {
        if (dto.getSenderId().equals(dto.getReceiverId())) {
            throw new IllegalArgumentException("You cannot send a connection request to yourself");
        }

        AlumniProfile sender = alumniRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender alumni not found with ID: " + dto.getSenderId()));

        AlumniProfile receiver = alumniRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver alumni not found with ID: " + dto.getReceiverId()));

        Optional<Connection> existing = connectionRepository.findBetweenUsers(dto.getSenderId(), dto.getReceiverId());
        if (existing.isPresent()) {
            Connection conn = existing.get();
            if (conn.getStatus() == ConnectionStatus.PENDING) {
                throw new IllegalArgumentException("A connection request is already pending between these alumni");
            } else if (conn.getStatus() == ConnectionStatus.ACCEPTED) {
                throw new IllegalArgumentException("These alumni are already connected");
            } else {
                // If previously rejected, allow re-requesting
                conn.setSender(sender);
                conn.setReceiver(receiver);
                conn.setStatus(ConnectionStatus.PENDING);
                return connectionRepository.save(conn);
            }
        }

        Connection connection = new Connection(sender, receiver);
        return connectionRepository.save(connection);
    }

    @Transactional
    public Connection acceptRequest(Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection not found with ID: " + connectionId));

        connection.setStatus(ConnectionStatus.ACCEPTED);
        return connectionRepository.save(connection);
    }

    @Transactional
    public Connection rejectRequest(Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection not found with ID: " + connectionId));

        connection.setStatus(ConnectionStatus.REJECTED);
        return connectionRepository.save(connection);
    }

    public List<Connection> getAlumniConnections(Long alumniId) {
        // Verify alumni exists
        if (!alumniRepository.existsById(alumniId)) {
            throw new ResourceNotFoundException("Alumni not found with ID: " + alumniId);
        }
        return connectionRepository.findByAlumniId(alumniId);
    }

    public List<AlumniProfile> getConnectedAlumni(Long alumniId) {
        List<Connection> accepted = connectionRepository.findByAlumniIdAndStatus(alumniId, ConnectionStatus.ACCEPTED);
        return accepted.stream()
                .map(c -> c.getSender().getId().equals(alumniId) ? c.getReceiver() : c.getSender())
                .collect(Collectors.toList());
    }
}


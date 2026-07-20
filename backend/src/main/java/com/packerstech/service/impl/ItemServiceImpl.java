package com.packerstech.service.impl;

import com.packerstech.dto.ItemRequest;
import com.packerstech.dto.ItemResponse;
import com.packerstech.entity.Item;
import com.packerstech.entity.Party;
import com.packerstech.exception.ResourceNotFoundException;
import com.packerstech.repository.ItemRepository;
import com.packerstech.repository.PartyRepository;
import com.packerstech.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final PartyRepository partyRepository;

    @Override
    public ItemResponse createItem(Long partyId, ItemRequest request) {
        Party party = partyRepository.findById(partyId)
                .orElseThrow(() -> new ResourceNotFoundException("Party not found with id: " + partyId));

        Item item = Item.builder()
                .party(party)
                .description(request.getDescription())
                .hsnSacCode(request.getHsnSacCode())
                .rate(request.getRate())
                .gstPercent(request.getGstPercent())
                .poNumber(request.getPoNumber())
                .build();

        Item savedItem = itemRepository.save(item);
        return mapToResponse(savedItem);
    }

    @Override
    public List<ItemResponse> getItemsByParty(Long partyId) {
        // Validate party exists first
        partyRepository.findById(partyId)
                .orElseThrow(() -> new ResourceNotFoundException("Party not found with id: " + partyId));

        return itemRepository.findByPartyIdOrderByUpdatedAtDesc(partyId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ItemResponse getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        return mapToResponse(item);
    }

    @Override
    public ItemResponse updateItem(Long id, ItemRequest request) {
        Item existingItem = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        existingItem.setDescription(request.getDescription());
        existingItem.setHsnSacCode(request.getHsnSacCode());
        existingItem.setRate(request.getRate());
        existingItem.setGstPercent(request.getGstPercent());
        existingItem.setPoNumber(request.getPoNumber());

        Item updatedItem = itemRepository.save(existingItem);
        return mapToResponse(updatedItem);
    }

    @Override
    public void deleteItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        itemRepository.delete(item);
    }

    private ItemResponse mapToResponse(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .partyId(item.getParty().getId())
                .description(item.getDescription())
                .hsnSacCode(item.getHsnSacCode())
                .rate(item.getRate())
                .gstPercent(item.getGstPercent())
                .poNumber(item.getPoNumber())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
